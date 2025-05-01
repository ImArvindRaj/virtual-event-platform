import { config } from "dotenv";
import { MongoClient } from "mongodb";

config();

const client = new MongoClient(process.env.MONGODB_URI!)

export const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log("Connected to database");
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1);
    }
}

export const getDatabase = () => {
    return client.db(process.env.DB_NAME);
}

export const closeDb = async () => {
    await client.close();
    console.log('✅ MongoDB connection closed');
  };