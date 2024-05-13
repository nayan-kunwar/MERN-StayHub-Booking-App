import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelSearchResponse, HotelType, PaymentIntentResponse, UserType } from "../../server/src/shared/types/types"
import { SearchParams } from "./types/searchParams";
import { BookingFormData } from "./forms/BookingForm/BookingForm";
// Retrieve API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Function to get current user 
export const fetchCurrentUser = async (): Promise<UserType> => {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
        credentials: "include"
    });
    if (!response.ok) {
        throw new Error("Error fetching user");
    }
    return response.json();
}

// Function to Register a User
export const register = async (formData: RegisterFormData) => {
    // Send a POST request to the user registration endpoint
    const response = await fetch(`${API_BASE_URL}/api/users/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData) // Convert form data to JSON string
    });

    // Parse the response body as JSON
    const responseBody = await response.json();

    // Check if the response is not OK (status code not in the range 200-299)
    if (!response.ok) {
        // Throw an error with the message from the response body (provided by the backend)
        throw new Error(responseBody.message); // message property for backend.
    }
}

// Fuction to Sign In a User
export const signIn = async (formData: SignInFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData),
    });

    const responseBody = await response.json(); //{message: ""}
    if (!response.ok) {
        throw new Error(responseBody.message);
    }

    return responseBody;
}

// Fuction to Sign Out a User
export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POSt",
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error("Error during sign out");
    }
}

// Function to Validate Token
export const validateToken = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
        credentials: "include",
    });

    if (!response.ok) {
        throw new Error("Invalid token")
    }
    const data = await response.json();
    //console.log(data); // Output the parsed JSON data
    return data;
}

// Function to Add Hotel
export const addMyHotel = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        method: "POST",
        credentials: "include",
        body: hotelFormData,
    });

    if (!response.ok) {
        throw new Error("Failed to add hotel");
    }

    return response.json();
};

// Function to Get All Hotels
export const fetchMyHotels = async (): Promise<HotelType[]> => { //Frontend and backend using same type, any changes in type reflect on both directly
    const response = await fetch(`${API_BASE_URL}/api/my-hotels`, {
        credentials: "include" // Tells browser to send the http cookie with fetch request
    });

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json(); // body of response. Array of hotels
}

// Function to Get Hotel By Id
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => { // component will know this function will return single hotel.
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelId}`, {
        credentials: "include" // Tells browser to send the http cookie with fetch request
    });

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json(); // body of response. individual hotel 
}

// Function to Upadate Hotel By Id
export const updateMyHotelById = async (hotelFormData: FormData) => {
    const response = await fetch(`${API_BASE_URL}/api/my-hotels/${hotelFormData.get("hotelId")}`,
        {
            method: "PUT",
            body: hotelFormData,
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update Hotel");
    }

    return response.json();
};

// Function to search hotels
export const searchHotels = async (searchParams: SearchParams): Promise<HotelSearchResponse> => {
    const queryParams = new URLSearchParams(); //destination=delhi&checkIn=2024-05-02T15 something like this
    queryParams.append("destination", searchParams.destination || "");
    queryParams.append("checkIn", searchParams.checkIn || "");
    queryParams.append("checkOut", searchParams.checkOut || "");
    queryParams.append("adultCount", searchParams.adultCount || "");
    queryParams.append("childCount", searchParams.childCount || "");
    queryParams.append("page", searchParams.page || "");

    queryParams.append("maxPrice", searchParams.maxPrice || "");
    queryParams.append("sortOption", searchParams.sortOption || "");

    searchParams.facilities?.forEach((facility) =>
        queryParams.append("facilities", facility)
    );

    searchParams.types?.forEach((type) => queryParams.append("types", type));
    searchParams.stars?.forEach((star) => queryParams.append("stars", star));

    const response = await fetch(
        `${API_BASE_URL}/api/hotels/search?${queryParams}`
    );

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
};

export const fetchHotelById = async (hotelId: string): Promise<HotelType> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}`);
    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json();
}

export const createPaymentIntent = async (hotelId: string, numberOfNights: string): Promise<PaymentIntentResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${hotelId}/bookings/payment-intent`,
        {
            credentials: "include",
            method: "POST",
            body: JSON.stringify({ numberOfNights }),
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Error fetching payment intent");
    }

    return response.json();
};

export const createRoomBooking = async (formData: BookingFormData) => {
    const response = await fetch(`${API_BASE_URL}/api/hotels/${formData.hotelId}/bookings`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify(formData),
        }
    ); 

    if (!response.ok) {
        throw new Error("Error booking room");
    }
};