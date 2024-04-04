import mongoose from "mongoose";


const connectToDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    } 
}

export default connectToDb;