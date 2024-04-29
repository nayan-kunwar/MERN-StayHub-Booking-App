import express, { Request, Response } from "express";
import Hotel from "../models/hotel";
import cloudinary from "cloudinary";
import { HotelType } from "../shared/types/types";

// Controller function to handle creation of new hotels
export const myHotels = async (req: Request, res: Response) => {
    try {
        // Extract image files and hotel details from request
        const imageFiles = req.files as Express.Multer.File[]; // Extract uploaded image files
        const newHotel: HotelType = req.body; // Extract hotel details

        // Upload images to cloudinary and get image URLs
        const imageUrls = await uploadImages(imageFiles);

        // Assign image URLs, user ID, and last updated timestamp to the new hotel
        newHotel.imageUrls = imageUrls;
        newHotel.lastUpdated = new Date();
        newHotel.userId = req.userId; // Assuming req.userId is set by middleware

        // Create a new Hotel instance and save it to the database
        const hotel = new Hotel(newHotel);
        await hotel.save();

        // Send the created hotel object in the response
        res.status(201).send(hotel);
    } catch (e) {
        // Handle errors
        console.log(e);
        res.status(500).json({ message: "Something went wrong" });
    }
}

// GET All Hotels
export const getAllHotels = async (req: Request, res: Response) => {
    try {
        const hotels = await Hotel.find({ userId: req.userId });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
}

// GET Hotel By Id
export const getHotelById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id.toString();
        const hotel = await Hotel.findOne({ _id: id, userId: req.userId });
        res.json(hotel); // Individula object. hotel = {}
    } catch (error) {
        res.status(500).json({ message: "Error fetching hotels" });
    }
}

// Upadate Hotel By Id
export const updateMyHotelById = async (req: Request, res: Response) => {
    try {
        const updatedHotel: HotelType = req.body;
        updatedHotel.lastUpdated = new Date();

        const hotel = await Hotel.findOneAndUpdate(
            {
                _id: req.params.hotelId,
                userId: req.userId,
            },
            updatedHotel,
            { new: true }
        );

        if (!hotel) {
            return res.status(404).json({ message: "Hotel not found" });
        }

        const files = req.files as Express.Multer.File[];
        const updatedImageUrls = await uploadImages(files);

        hotel.imageUrls = [
            ...updatedImageUrls,
            ...(updatedHotel.imageUrls || []),
        ];

        await hotel.save();
        res.status(201).json(hotel);
    } catch (error) {
        res.status(500).json({ message: "Something went throw" });
    }
}
// Function to upload images to cloudinary
async function uploadImages(imageFiles: Express.Multer.File[]) {
    // Map each image file to a promise that uploads it to cloudinary and returns its URL
    const uploadPromises = imageFiles.map(async (image) => {
        // Convert image buffer to base64 format
        const b64 = Buffer.from(image.buffer).toString("base64");
        // Create data URI from base64 string
        let dataURI = "data:" + image.mimetype + ";base64," + b64;
        // Upload image to cloudinary and get URL
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url; // Return the URL of the uploaded image
    });

    // Wait for all image upload promises to resolve and return array of image URLs
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls; // Return array of image URLs
}
