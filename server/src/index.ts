import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; // Loads env variables when app start.
import connectToDb from "./db/index";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import myHotelRoutes from "./routes/my-hotels";
import hotelRoutes from "./routes/hotel"
import bookingRoutes from "./routes/my-bookings";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// Bundle frontend code with backend code, so both can serve from same server. Frontend protected route will not be here like add-hotel add manually
app.use(express.static(path.join(__dirname, "../../client/dist")));

//APIs
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings", bookingRoutes);

// Request are not api routes[backend routes] like add-hotel and req those are behind conditional logic go to [ index.html ] in dist folder of client. 
// And react router will handle req like [ add-hotel ] req. 
// protect routes like add-hotel and routes behind conditional logic are not part of static file that we deployed on deploy time ../../client/dist, they generated on when user requested 
app.get("*", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

// //API for testing
// app.get("/api/test", (req: Request, res: Response) => {
//     res.json({ message: "API is working" });
// });

