import AWS from "aws-sdk";
import { config } from "dotenv";

config();

AWS.config.credentials = new AWS.Credentials({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export default AWS;
