import { MongoClient } from "mongodb";
import dotenv from "dotenv"

dotenv.config();

export const client = new MongoClient(
    process.env.MONGODB_URI || "mongodb://localhost:27017"
);
export const db = client.db("av");

export const usersCl = db.collection("users");
export const categoryCl = db.collection("category");
export const videosCl = db.collection("videos");
export const tagsCl = db.collection("tags");
