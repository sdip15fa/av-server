import { ObjectId } from "mongodb";

export default class Category {
    constructor(
        public categoryId: number,
        public categoryName: string,
        public videoCount: number,
        public categoryImageUrl?: string,
        public _id?: ObjectId
    ) {}
}
