import { FastifyInstance, FastifyPluginOptions } from "fastify";
import create from "./videos/create";
import videos from "./videos/videos";
import modify from "./videos/modify";
import info from "./videos/info";
import deleteVideo from "./videos/delete";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.register(create);
    fastify.register(videos);
    fastify.register(videos, { prefix: "/search" });
    fastify.register(modify);
    fastify.register(info);
    fastify.register(deleteVideo);
    done();
}
