import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { verifyToken } from "../../lib/auth";
import { videosCl } from "../../lib/db";
import AWS from "../../lib/s3";
import Video from "../../schema/video";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.delete(
        "/:videoId",
        async (req: FastifyRequest<{ Params: { videoId: string } }>, res) => {
            const { videoId } = req.params;

            if (verifyToken(req.headers.authorization)?.role !== "admin")
                return res.code(403).send({ success: false, error: "Forbidden." });

            const video = (await videosCl.findOne({ videoId })) as Video;

            if (!video)
                return res.code(404).send({ success: false, error: "Video not found." });

            try {
                await new AWS.S3({ apiVersion: "2006-03-01" })
                    .deleteObject({
                        Bucket: process.env.AWS_BUCKET_NAME,
                        Key: `videos/${video.videoUrl.split("/").pop()}`,
                    })
                    .promise();
            } catch {
                return res
                    .code(500)
                    .send({ success: false, error: "Failed to delete video from AWS s3." });
            }
            await videosCl.deleteOne({ videoId });

            return res.send({ success: true });
        }
    );
    done();
}
