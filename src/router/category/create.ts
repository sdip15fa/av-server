import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { verifyToken } from "../../lib/auth";
import { categoryCl } from "../../lib/db";
import { genCategoryId } from "../../lib/genId";
import { ajv } from "../../lib/ajv";
import Category from "../../schema/category";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const schema = Type.Object(
        {
            categoryName: Type.String({ maxLength: 15, minLength: 1 }),
            categoryImageUrl: Type.Optional(Type.String({ format: "uri" })),
        },
        { additionalProperties: false }
    );

    fastify.post(
        "/create",
        async (req: FastifyRequest<{ Body: Static<typeof schema> }>, res) => {
            if (!ajv.validate(schema, req.body))
                return res.code(400).send({ success: false, error: "Bad request." });

            if (verifyToken(req.headers.authorization)?.role !== "admin")
                return res.code(401).send({ success: false, error: "Unauthorized." });

            if (await categoryCl.findOne({ categoryName: req.body.categoryName }))
                return res
                    .code(409)
                    .send({ success: false, error: "Category name already in use." });

            const { categoryName, categoryImageUrl } = req.body;
            const categoryId = await genCategoryId();

            await categoryCl.insertOne({
                categoryId,
                categoryName,
                ...categoryImageUrl && { categoryImageUrl },
                videoCount: 0,
            } as Category);

            res.send({ success: true, categoryId });
        }
    );
    done();
}
