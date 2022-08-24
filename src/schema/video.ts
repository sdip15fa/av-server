import { ObjectId } from "mongodb";
import Category from "./category";
import { userRole } from "./user";

export default class Video {
    constructor(
        public category: Category,
        public videoId: string,
        public videoDisplayName: string,
        public videoDuration: number,
        public videoTag: string[],
        public videoUrl: string,
        public viewCount: number,
        public uploadTime: Date,
        public uploadUser: { userName: string; userId: string; role: userRole },
        public videoPreviewImage?: string,
        public _id?: ObjectId
    ) {}
}
