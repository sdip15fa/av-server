import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import Tag from "../../schema/tag";
import { ajv } from "../../lib/ajv";
import { tagsCl } from "../../lib/db";

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
            req: FastifyRequest<{ Querystring: { sort?: Static<typeof sortSchema> } }>,
            res
        ) => {
            const { sort } = req.query;

            const tags = (await tagsCl
                .find()
                .sort({
                    ...(sort === "popular" && { videoCount: -1 }),
                    ...(sort === "latest" && { lastModified: -1 }),
                })
                .project({ _id: 0 })
                .toArray()) as Tag[];

            res.send({ success: true, tags });
        }
    );
    done();
}
