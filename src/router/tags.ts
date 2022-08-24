import { FastifyInstance, FastifyPluginOptions } from "fastify";
import tags from "./tags/tags";
import info from "./tags/info";

export default function (fastify: FastifyInstance, opts: FastifyPluginOptions, done: (err?: Error) => void) {
    fastify.register(tags);
    fastify.register(info);
    done();
}
