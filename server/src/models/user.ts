import mongoose from "mongoose";
import { UserType } from "../shared/types/types";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    }
}, { timestamps: true });

//In this scenario, the middleware function correctly identifies that the password field has been modified (since this is a new user), 
//and it proceeds to hash the password before saving the document to the database. This ensures that the first user's password is hashed 
//before being stored in the database, providing the necessary security measure for user credentials.

// Middleware to hash the password before saving.
userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
})

const User = mongoose.model<UserType>("User", userSchema);
export default User;