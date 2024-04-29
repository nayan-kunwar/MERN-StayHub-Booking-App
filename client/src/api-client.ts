import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";
import { HotelType } from "../../server/src/shared/types/types"
// Retrieve API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

// Function to Get single Hotel
export const fetchMyHotelById = async (hotelId: string): Promise<HotelType> => { // component will know this function will return single hotel.
    const response = await fetch(`${API_BASE_URL}/my-hotels/${hotelId}`, {
        credentials: "include" // Tells browser to send the http cookie with fetch request
    });

    if (!response.ok) {
        throw new Error("Error fetching hotels");
    }

    return response.json(); // body of response. individual hotel 
}
