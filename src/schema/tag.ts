import { ObjectId } from "mongodb";

export default class Tag {
    constructor(
        public tagName: string,
        public videoCount: number,
        public lastModified: Date,
        public _id?: ObjectId
    ) {}
}
