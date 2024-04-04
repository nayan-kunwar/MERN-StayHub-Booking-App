import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config"; // Loads env variables when app start.
import connectToDb from "./db/index"

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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors()); 

//API for testing
app.get("/api/test", (req: Request, res: Response) => {
    res.json({ message: "API is working" });
});

