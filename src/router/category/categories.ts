import { FastifyInstance, FastifyPluginOptions } from "fastify";
import Category from "../../schema/category";
import { categoryCl } from "../../lib/db";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.get("/", async (req, res) => {
        const categories = (await categoryCl
            .find()
            .sort({ categoryId: 1 })
            .project({ _id: 0 })
            .toArray()) as Category[];
        res.send({ success: true, categories });
    });
    done();
}
