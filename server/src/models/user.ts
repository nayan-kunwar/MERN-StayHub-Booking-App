import mongoose from "mongoose";
import { UserType } from "../shared/types/types";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is Required"], // Can catch error in console while regsitering user. Empty stiring will also invalid.
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password must be 6 characters or more"],
    },
    firstName: {
        type: String,
        required: [true, "First Name is Required"],
    },
    lastName: {
        type: String,
        required: [true, "Last Name is Required"],
    }
}, { timestamps: true });

//In this scenario, the middleware function correctly identifies that the password field has been modified (since this is a new user), 
//and it proceeds to hash the password before saving the document to the database. This ensures that the first user's password is hashed 
//before being stored in the database, providing the necessary security measure for user credentials.

// Middleware to hash the password before saving.
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

//Mongoose: Instance methods or Instance methods in typscript
// userSchema.methods.isPasswordValid = async function (password) {
//     return await bcrypt.compare(password, this.password);
// }

const User = mongoose.model<UserType>("User", userSchema);
export default User;