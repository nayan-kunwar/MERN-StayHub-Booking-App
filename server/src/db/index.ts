import mongoose from "mongoose";


const connectToDb = async () => {
    try {
       //const connectionInstance = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string); //db name will be test as we using just connection string-> mongodb://localhost:27017 
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${process.env.MONGODB_DATABASE_NAME}`); //mongodb://localhost:27017/your-db-name
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    } 
}

export default connectToDb;