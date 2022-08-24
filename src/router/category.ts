import { FastifyInstance, FastifyPluginOptions } from "fastify";
import create from "./category/create";
import info from "./category/info";
import modify from "./category/modify";
import categories from "./category/categories";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.register(create);
    fastify.register(info);
    fastify.register(modify);
    fastify.register(categories);
    done();
}
