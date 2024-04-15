import React, { useContext, useState } from "react";
import Toast from "../components/Toast";

// Define the type for the ToastMessage object
type ToastMessage = { message: string; type: "SUCCESS" | "ERROR" };

// Define the type for the AppContext
type AppContext = { showToast: (toastMessage: ToastMessage) => void };

// Create a new React context with the AppContext type
const AppContext = React.createContext<AppContext | undefined>(undefined);

// Provide the AppContext to the application
export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [toast, setToast] = useState<ToastMessage | undefined>(undefined);
    // Return the AppContext.Provider component, which will wrap the children
    return (
        <AppContext.Provider
            value={{
                // Provide the showToast function to the context
                showToast: (toastMessage) => {
                    //console.log(toastMessage);
                    setToast(toastMessage);
                },
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