import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; // Loads env variables when app start.
import connectToDb from "./db/index";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import cookie from "cookie-parser";
import cookieParser from "cookie-parser";

//DB Connection
connectToDb()
    .then(() => {
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running at port : ${process.env.PORT}`);
        })
    })
    .catch((error) => {
        console.log("MONGO db connection failed !!! ", error);
    })

const app = express();

//Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

//APIs
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


// //API for testing
// app.get("/api/test", (req: Request, res: Response) => {
//     res.json({ message: "API is working" });
// });

