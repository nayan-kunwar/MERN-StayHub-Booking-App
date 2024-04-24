import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login User Controller
export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    console.log(`loginUser- email: ${email}, password: ${password}`);

    if (!email || !password) { // if (!(username || email)){}
        return res.status(400).json({ error: "username or password required" }); // Dont use invalid here as we are just checking for empty field.
    }
    try {
        const user = await User.findOne({ email });
        //null check for user, otherwise we will get ts error in user.password wehn comparing password.
        if (!user) {
            return res.status(400).json({ error: "Invalid user credentials" });
        }

        // const isValid = await user.isPasswordValid(password);// When defining isPasswordValid() method in user user models.
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid user credentials" });
        }

        //Generate Access Token.
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY as string, {
            expiresIn: "1d"
        });

        //Access Token
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 86400000 // milliseconds
        });

        return res.status(200).json({ userId: user._id, message: "Login Succesfull" });

    } catch (error) {
        console.log("Error in loginUser controller-", error); // Can catch error in console while login user.
        return res.status(500).json({ message: "Something went wrong" });
    }
}

// Logout User Controller
export const logoutUser = (req: Request, res: Response) => {
    res.cookie("auth_token", "", {
        expires: new Date(0)
    });
    res.send();
}

export const validateToken = async (req: Request, res: Response) => {
    res.status(200).send({ userId: req.userId }); //response.json = {userId: '66256375182af6b9a7a33238'}
}