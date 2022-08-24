import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { categoryCl } from "../../lib/db";
import { ajv } from "../../lib/ajv";
import Category from "../../schema/category";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.get("/:id", async (req: FastifyRequest<{ Params: { id: string } }>, res) => {
        const categoryId = Number(req.params.id);

        if (!ajv.validate(Type.Integer({ minimum: 1 }), categoryId))
            return res.code(400).send({ success: false, error: "Bad request." });

        const category = (await categoryCl.findOne(
            { categoryId },
            { projection: { _id: 0 } }
        )) as Category;

        if (!category)
            return res.code(404).send({ success: false, error: "Category not found." });

        res.send({ success: true, category });
    });
    done();
}
