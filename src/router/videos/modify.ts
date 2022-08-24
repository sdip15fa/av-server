import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { categoryCl, videosCl } from "../../lib/db";
import { ajv } from "../../lib/ajv";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const schema = Type.Object(
        {
            videoId: Type.RegEx(/^\d+$/),
            categoryId: Type.Optional(Type.Integer({ minimum: 1 })),
            videoDisplayName: Type.Optional(Type.String()),
            videoDuration: Type.Optional(Type.Integer({ minimum: 0 })),
            videoPreviewImage: Type.Optional(Type.String({ format: "uri" })),
            videoTag: Type.Optional(Type.Array(Type.String())),
            videoUrl: Type.Optional(Type.String({ format: "uri" })),
        },
        { additionalProperties: false }
    );
    fastify.put(
        "/modify",
        async (req: FastifyRequest<{ Body: Static<typeof schema> }>, res) => {
            if (!ajv.validate(schema, req.body))
                return res.code(400).send({ success: false, error: "Bad request." });

            const {
                videoId,
                categoryId,
                videoDisplayName,
                videoDuration,
                videoPreviewImage,
                videoTag,
                videoUrl,
            } = req.body;

            if (!(await videosCl.findOne({ videoId })))
                return res.code(404).send({ success: false, error: "Video not found." });

            const category =
                categoryId &&
                (await categoryCl.findOne(
                    { categoryId },
                    { projection: { _id: 0, videoCount: 0 } }
                ));
            if (categoryId && !category)
                return res
                    .code(404)
                    .send({ success: false, error: "Category not found." });

            await videosCl.updateOne(
                { videoId },
                {
                    $set: {
                        ...(category && { category }),
                        ...(videoDisplayName && { videoDisplayName }),
                        ...(videoDuration && { videoDuration }),
                        ...(videoPreviewImage && { videoPreviewImage }),
                        ...(videoTag && { videoTag }),
                        ...(videoUrl && { videoUrl }),
                    },
                }
            );

            res.send({
                success: true,
                video: await videosCl.findOne({ videoId }, { projection: { _id: 0 } }),
            });
        }
    );
    done();
}
