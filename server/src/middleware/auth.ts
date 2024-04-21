import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Declare global namespace to extend the Request interface
declare global {
    namespace Express {
        interface Request {
            userId: string;
        }
    }
}

// Middleware function to verify JWT token and extract userId
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["auth_token"];
    if (!token) {
        return res.status(401).send({ message: "Unauthorized!" });
    }

    try {
        // Verify the JWT token and extract its payload
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as JwtPayload;
        //console.log(decodedToken); we will get object, payload data of token
        // Assign the userId from the decoded token to the Request object
        req.userId = decodedToken.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: "unauthorized" });
    }
}