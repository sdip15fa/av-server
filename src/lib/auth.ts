import jwt from "jsonwebtoken";
import { jwtType } from "../schema/user";
import dotenv from "dotenv";

dotenv.config();

export const createToken = (user: jwtType): string => {
    const { userId, userName, email, role } = user;
    return jwt.sign({ userId, userName, email, role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};

export const verifyToken: (token: string) => null | jwtType = (token: string) => {
    if (!token) return null;
    try {
        return jwt.verify(token?.slice(7), process.env.JWT_SECRET) as jwtType;
    } catch {
        return null;
    }
};
