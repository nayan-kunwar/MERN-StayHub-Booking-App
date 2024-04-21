import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

// errors object look like
// errors = {
//     username: "This field is required",
//     email: "Invalid email format",
//     password: {
//       message: "Password must be at least 6 characters long",
//       type: "minLength"
//     }
//     // Other fields and their errors
//   };

const Register = () => {
    const navigate = useNavigate();
    const { showToast } = useAppContext();
    const { register, watch, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();

    const mutation = useMutation(apiClient.register, {
        onSuccess: () => {
            //console.log(`User registration successful`)
            showToast({ message: "Registration Successful", type: "SUCCESS" });
            navigate("/");
        },
        onError: (error: Error) => {
            // console.log(error.message)
            showToast({ message: error.message, type: "ERROR" });
        }
    });

    // handleSubmit will be called when all input field are valid. and data will be printed on console. It has a function which recive data on successful validation
    const onSubmitHandler = handleSubmit((data) => {
        //console.log(data); // object: data = {containing all input field in key value pair}
        mutation.mutate(data); //Will call apiClient.register and pass data to it
    });

    //console.log(`errors: ${errors.firstName?.message}`);
    //console.log(watch("firstName")); // you can watch individual input/value of input field

    return (
        <form className="flex flex-col gap-5"
            onSubmit={onSubmitHandler}>
            <h2 className="text-3xl font-bold">Create an Account</h2>

            <div className="flex flex-col md:flex-row gap-5">
                <label className="text-gray-700 text-sm font-bold flex-1">
                    First Name
                    <input
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("firstName", {
                            required: "This field is required"
                        })} />
                    {errors.firstName && (
                        <span className="text-red-500">{errors.firstName.message}</span> //errors.firstName.message indicates that TypeScript is inferring the types correctly for your errors object.
                    )}
                </label>
                <label
                    className="text-gray-700 text-sm font-bold flex-1">
                    Last Name
                    <input
                        className="border rounded w-full py-1 px-2 font-normal"
                        {...register("lastName", {
                            required: "This field is required"
                        })} />
                    {errors.lastName && (
                        <span className="text-red-500">{errors.lastName.message}</span>
                    )}
                </label>
            </div>

            <label
                className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email", {
                        required: "This field is required"
                    })} />
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>

            <label
                className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("password", {
                        required: "This field is required",
                        minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters"
                        }
                    })
                    } />
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>

            <label
                className="text-gray-700 text-sm font-bold flex-1">
                Confirm Password
                <input type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("confirmPassword", {
                        validate: (val) => {
                            if (!val) {
                                return "This field is required"; {/* errors will return when field validation fails  */ }
                            } else if (watch("password") !== val) {
                                {/*watch the value of password field*/ }
                                return "Your passwaords do not match";
                            }
                        },
                    })
                    } />
                {errors.confirmPassword && (
                    <span className="text-red-500">{errors.confirmPassword.message}</span>
                )}
            </label>

            <span>
                <button
                    type="submit"
                    className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-xl">
                    Create Account
                </button>
            </span>
        </form>
    )
}

export default Register;