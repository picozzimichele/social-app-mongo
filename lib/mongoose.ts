import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery", true);

    if (!process.env.MONGODB_URL) {
        return console.log("No MongoDB URL provided");
    }

    if (isConnected) {
        return console.log("Using existing connection");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URL);
        isConnected = true;
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error connecting to MongoDB", err);
    }
};
