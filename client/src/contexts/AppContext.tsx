import React, { useContext, useState } from "react";
import Toast from "../components/Toast";
import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import { loadStripe, Stripe } from "@stripe/stripe-js";

const STRIPE_PUB_KEY = import.meta.env.VITE_STRIPE_PUB_KEY || "";

// Define the type for the ToastMessage object
type ToastMessage = { message: string; type: "SUCCESS" | "ERROR" };

// Define the type for the AppContext
type AppContext = {
    showToast: (toastMessage: ToastMessage) => void;
    isLoggedIn: boolean;
    stripePromise: Promise<Stripe | null>;
};

// Create a new React context with the AppContext type
const AppContext = React.createContext<AppContext | undefined>(undefined);

const stripePromise = loadStripe(STRIPE_PUB_KEY);

// Provide the AppContext to the application
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    const { isError } = useQuery("validateToken", apiClient.validateToken, { retry: false });
    // console.log(isError);
    // Return the AppContext.Provider component, which will wrap the children
    return (
        <AppContext.Provider
            value={{
                // Provide the showToast function to the context
                showToast: (toastMessage) => {
                    //console.log(toastMessage);
                    setToast(toastMessage);
                },
                isLoggedIn: !isError,
                stripePromise
            }}
        >
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(undefined)} />)}
            {children}
        </AppContext.Provider>
    );
};

// Define a custom hook to simplify the usage of the AppContext
export const useAppContext = () => {
    // Use the useContext hook to access the AppContext
    const context = useContext(AppContext);

    // Ensure that the context has the expected shape (AppContext)
    return context as AppContext;
};