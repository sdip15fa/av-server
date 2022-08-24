import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import Video from "../../schema/video";
import { ajv } from "../../lib/ajv";
import { videosCl } from "../../lib/db";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const sortSchema = Type.Optional(
        Type.Union([Type.Literal("latest"), Type.Literal("popular")])
    );

    fastify.get(
        "/",
        async (
            req: FastifyRequest<{
                Querystring: {
                    cat?: string;
                    tag?: string;
                    filter?: string;
                    userId?: string;
                    q?: string;
                    sort?: Static<typeof sortSchema>;
                    page?: number;
                    limit?: number;
                };
            }>,
            res
        ) => {
            const categoryId = Number(req.query.cat) || undefined;
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 20;
            const { tag, filter, userId, q, sort } = req.query;

            if (
                !ajv.validate(
                    Type.Object({
                        categoryId: Type.Optional(Type.Integer({ minimum: 1 })),
                        filter: Type.Optional(
                            Type.Union([Type.Literal("latest"), Type.Literal("popular")])
                        ),
                        userId: Type.Optional(Type.RegEx(/^\d+$/)),
                        sort: sortSchema,
                        page: Type.Optional(Type.Integer({ minimum: 1 })),
                        limit: Type.Optional(Type.Integer({ minimum: 1 })),
                    }),
                    { categoryId, filter, userId, sort, page, limit }
                )
            )
                return res.code(400).send({ success: false, error: "Bad request." });

            // 3 days
            const latestSeconds = 1000 * 60 * 60 * 24 * 3;

            const videos = await videosCl
                .aggregate([
                    {
                        $match: {
                            ...(categoryId && { "category.categoryId": categoryId }),
                            ...(tag && { videoTag: { $elemMatch: { $eq: tag } } }),
                            ...(filter === "popular" && { viewCount: { $gt: 100 } }),
                            ...(filter === "latest" && {
                                uploadTime: { $gt: new Date(Date.now() - latestSeconds) },
                            }),
                            ...(q && { videoDisplayName: { $regex: q, $options: "i" } }),
                            ...(userId && { "uploadUser.userId": userId }),
                        },
                    },
                    { $addFields: { rand: { $rand: {} } } },
                    {
                        $sort: {
                            ...((filter === "popular" || sort === "popular") && {
                                viewCount: -1,
                            }),
                            ...((filter === "latest" || sort === "latest") && {
                                uploadTime: -1,
                            }),
                            rand: 1,
                        },
                    },
                    { $skip: (page - 1) * limit },
                    { $limit: limit },
                    { $project: { _id: 0, rand: 0 } },
                ])
                .toArray();

            const count = await videosCl.countDocuments({
                ...(categoryId && { "category.categoryId": categoryId }),
                ...(tag && { videoTag: { $elemMatch: { $eq: tag } } }),
                ...(filter === "popular" && { viewCount: { $gt: 100 } }),
                ...(filter === "latest" && {
                    uploadTime: { $gt: new Date(Date.now() - latestSeconds) },
                }),
                ...(q && { videoDisplayName: { $regex: q, $options: "i" } }),
                ...(userId && { "uploadUser.userId": userId }),
            });

            res.send({ success: true, videos, count });
        }
    );
    done();
}
