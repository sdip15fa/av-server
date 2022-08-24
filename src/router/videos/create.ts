import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { categoryCl, tagsCl, videosCl } from "../../lib/db";
import { ajv } from "../../lib/ajv";
import { verifyToken } from "../../lib/auth";
import { genVideoId } from "../../lib/genId";
import Video from "../../schema/video";
import Category from "../../schema/category";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const schema = Type.Object(
        {
            categoryId: Type.Integer({ minimum: 1 }),
            videoDisplayName: Type.String(),
            videoDuration: Type.Integer({ minimum: 1 }),
            videoPreviewImage: Type.Optional(Type.RegEx(new RegExp(`^${process.env.cfUrl}/images/[0-9]{6}-\\S+$`))),
            videoTag: Type.Array(Type.String()),
            videoUrl: Type.RegEx(new RegExp(`^${process.env.cfUrl}/videos/[0-9]{6}-\\S+$`)),
        },
        { additionalProperties: false }
    );
    fastify.post(
        "/create",
        async (req: FastifyRequest<{ Body: Static<typeof schema> }>, res) => {
            const {
                categoryId,
                videoDisplayName,
                videoDuration,
                videoPreviewImage,
                videoTag,
                videoUrl,
            } = req.body;

            if (!ajv.validate(schema, req.body))
                return res.code(400).send({ success: false, error: "Bad request." });

            const user = verifyToken(req.headers.authorization);
            if (!user)
                return res.code(401).send({ success: false, error: "Unauthorized." });

            const category = await categoryCl.findOne(
                { categoryId },
                { projection: { _id: 0, videoCount: 0 } }
            ) as Category;

            if (!category)
                return res
                    .code(404)
                    .send({ success: false, error: "Category not found." });

            const video: Video = {
                category,
                videoId: await genVideoId(),
                videoDisplayName,
                videoDuration,
                ...(videoPreviewImage && { videoPreviewImage }),
                videoTag,
                videoUrl,
                uploadTime: new Date(),
                uploadUser: { userName: user.userName, userId: user.userId, role: user.role },
                viewCount: 0,
            };

            await videosCl.insertOne(video);
            await categoryCl.updateOne({ categoryId }, { $inc: { videoCount: 1 } });

            await Promise.all(
                videoTag.map(async (tag) => {
                    if (
                        !(
                            await tagsCl.updateOne(
                                { tagName: tag },
                                {
                                    $inc: { videoCount: 1 },
                                    $currentDate: { lastModified: true },
                                }
                            )
                        ).matchedCount
                    )
                        await tagsCl.insertOne({
                            tagName: tag,
                            videoCount: 1,
                            lastModified: new Date(),
                        });
                })
            );

            res.send({ success: true, video });
        }
    );
    done();
}
