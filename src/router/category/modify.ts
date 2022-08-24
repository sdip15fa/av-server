import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { categoryCl } from "../../lib/db";
import { ajv } from "../../lib/ajv";
import { verifyToken } from "../../lib/auth";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const schema = Type.Object(
        {
            categoryId: Type.Integer({ minimum: 1 }),
            categoryName: Type.Optional(Type.String({ maxLength: 15, minLength: 1 })),
            categoryImageUrl: Type.Optional(Type.String({ format: "uri" })),
        },
        { additionalProperties: false }
    );

    fastify.put(
        "/modify",
        async (req: FastifyRequest<{ Body: Static<typeof schema> }>, res) => {
            const { categoryId, categoryName, categoryImageUrl } = req.body;

            if (!ajv.validate(schema, req.body))
                return res.code(400).send({ success: false, error: "Bad request." });

            if (verifyToken(req.headers.authorization)?.role !== "admin")
                return res.code(401).send({ success: false, error: "Unauthorized." });

            const category = await categoryCl.findOne({ categoryId });

            if (!category)
                return res.code(404).send({ success: false, error: "Category not found." });

            if (await categoryCl.findOne({ categoryName }))
                return res.code(409).send({ success: false, error: "Category name already exists." });

            await categoryCl.updateOne(
                { categoryId },
                {
                    $set: {
                        ...(categoryName && { categoryName }),
                        ...(categoryImageUrl && { categoryImageUrl }),
                    },
                }
            );

            res.send({ category: { ...category, ...req.body }, success: true });
        }
    );

    done();
}
