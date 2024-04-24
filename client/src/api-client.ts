import { RegisterFormData } from "./pages/Register";
import { SignInFormData } from "./pages/SignIn";

// Retrieve API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Function to register a user
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

// Fuction to sign in a user
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

// Fuction to sign in a user
export const signOut = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POSt",
        credentials: "include",
    });
    if(!response.ok){
        throw new Error("Error during sign out");
    }
}

// Function to validate token
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

