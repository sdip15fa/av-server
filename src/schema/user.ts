import { ObjectId } from "mongodb";

export default class User {
    constructor(
        // 000000x
        public userId: string,
        public userName: string,
        public email: string,
        public password: string,
        public creationTime: Date,
        public role: "user" | "admin",
        public _id?: ObjectId
    ) {}
}

export type userRole = "user" | "admin";

export type jwtType = {
    userId: string;
    userName: string;
    email: string;
    role: userRole;
};
