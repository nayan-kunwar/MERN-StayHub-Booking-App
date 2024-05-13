import { Request, Response } from "express";
import Hotel from "../models/hotel";
import { BookingType, HotelSearchResponse } from "../shared/types/types";
import { validationResult } from "express-validator";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_KEY as string);

export const searchHotels = async (req: Request, res: Response) => {
    try {
        const query = constructSearchQuery(req.query);

        let sortOptions = {};
        switch (req.query.sortOption) {
            case "starRating":
                sortOptions = { starRating: -1 };
                break;
            case "pricePerNightAsc":
                sortOptions = { pricePerNight: 1 };
                break;
            case "pricePerNightDesc":
                sortOptions = { pricePerNight: -1 };
                break;
        }

        const pageSize = 5;
        const pageNumber = parseInt(req.query.page ? req.query.page.toString() : "1");
        const skip = (pageNumber - 1) * pageSize;

        const hotels = await Hotel.find(query)
            .sort(sortOptions) //sorting
            .skip(skip).limit(pageSize); //pagination
        const total = await Hotel.countDocuments(query);

        const response: HotelSearchResponse = {
            data: hotels,
            pagination: {
                total,
                page: pageNumber,
                pages: Math.ceil(total / pageSize), // pages = ceil(54/5) = ceil(10.8) = 11 [give value equal to or greater than 10.8]
            }
        };

        res.json(response);
    } catch (error) {
        console.log("error", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const getHotelById = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const id = req.params.id.toString();

    try {
        const hotel = await Hotel.findById(id);
        res.json(hotel);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching hotel" });
    }
}

export const createPaymentIntent = async (req: Request, res: Response) => {
    // 1. totalCost, 2. hotelId, 3. userId
    console.log("Received request to create payment intent");

    const { numberOfNights } = req.body;
    const hotelId = req.params.hotelId;
    console.log("Received numberOfNights:", numberOfNights);
    console.log("Received hotelId:", hotelId);

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
        console.log("Hotel not found");
        return res.status(400).json({ message: "Hotel not found" });
    }

    const totalCost = hotel.pricePerNight * numberOfNights;
    console.log("Calculated total cost:", totalCost);

    const paymentIntent = await stripe.paymentIntents.create({
        amount: totalCost * 100,
        currency: "inr",
        metadata: {
            hotelId,
            userId: req.userId,
            description: "Booking payment for hotel reservation" 
        },
    });

    if (!paymentIntent.client_secret) {
        console.log("Error creating payment intent");
        return res.status(500).json({ message: "Error creating payment intent" });
    }

    const response = {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret.toString(),
        totalCost,
    };

    console.log("Payment intent created successfully:", response);

    res.send(response);
}


export const createBooking = async (req: Request, res: Response) => {
    try {
        console.log("Creating booking...");

        const paymentIntentId = req.body.paymentIntentId;

        console.log("Payment Intent ID:", paymentIntentId);

        const paymentIntent = await stripe.paymentIntents.retrieve(
            paymentIntentId as string
        );

        console.log("Retrieved Payment Intent:", paymentIntent);

        if (!paymentIntent) {
            console.log("Payment intent not found");
            return res.status(400).json({ message: "payment intent not found" });
        }

        if (
            paymentIntent.metadata.hotelId !== req.params.hotelId ||
            paymentIntent.metadata.userId !== req.userId
        ) {
            console.log("Payment intent mismatch");
            return res.status(400).json({ message: "payment intent mismatch" });
        }

        if (paymentIntent.status !== "succeeded") {
            console.log("Payment intent not succeeded");
            return res.status(400).json({
                message: `payment intent not succeeded. Status: ${paymentIntent.status}`,
            });
        }

        const newBooking: BookingType = {
            ...req.body,
            userId: req.userId,
        };

        console.log("New Booking:", newBooking);

        const hotel = await Hotel.findOneAndUpdate(
            { _id: req.params.hotelId },
            {
                $push: { bookings: newBooking },
            }
        );

        console.log("Updated Hotel:", hotel);

        if (!hotel) {
            console.log("Hotel not found");
            return res.status(400).json({ message: "hotel not found" });
        }

        await hotel.save();

        console.log("Booking saved successfully");
        res.status(200).send();
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ message: "something went wrong" });
    }
};


const constructSearchQuery = (queryParams: any) => {
    let constructedQuery: any = {};

    if (queryParams.destination) {
        constructedQuery.$or = [
            { city: new RegExp(queryParams.destination, "i") },
            { country: new RegExp(queryParams.destination, "i") },
        ];
    }

    if (queryParams.adultCount) {
        constructedQuery.adultCount = {
            $gte: parseInt(queryParams.adultCount),
        };
    }

    if (queryParams.childCount) {
        constructedQuery.childCount = {
            $gte: parseInt(queryParams.childCount),
        };
    }

    if (queryParams.facilities) {
        constructedQuery.facilities = {
            $all: Array.isArray(queryParams.facilities)
                ? queryParams.facilities
                : [queryParams.facilities],
        };
    }

    if (queryParams.types) {
        constructedQuery.type = {
            $in: Array.isArray(queryParams.types)
                ? queryParams.types
                : [queryParams.types],
        };
    }

    if (queryParams.stars) {
        const starRatings = Array.isArray(queryParams.stars)
            ? queryParams.stars.map((star: string) => parseInt(star))
            : parseInt(queryParams.stars);

        constructedQuery.starRating = { $in: starRatings };
    }

    if (queryParams.maxPrice) {
        constructedQuery.pricePerNight = {
            $lte: parseInt(queryParams.maxPrice).toString(),
        };
    }
    console.log(constructedQuery);
    return constructedQuery;
};