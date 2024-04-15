import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

//Resgister User Controller.
export const registerUser = async (req: Request, res: Response) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        console.log("DB user: ", user);
        if (user) {
            return res.status(400).json({ message: "User already exists!" });
        }
        user = new User(req.body);
        console.log("registerUser before saving to db user: ", user);
        await user.save(); // Will check schema validation before saving it.

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d"
        });

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // milliseconds
        });
        return res.status(201).send({ message: "User registered Successfully" }); // Working fine without return. message wil show in NETWORK tab-> Preview Tab and response
    } catch (error) {
        console.log("Error in registerUser controller-", error); // Can catch error in console while regsitering user.
        return res.status(500).json({ message: "Something went wrong." });
    }
}