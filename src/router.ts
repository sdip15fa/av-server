import { FastifyInstance, FastifyPluginOptions } from "fastify";
import users from "./router/users";
import category from "./router/category";
import video from "./router/videos";
import tags from "./router/tags";

export default function (
    fastify: FastifyInstance,
    _opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.register(users, { prefix: "/users" });
    fastify.register(category, { prefix: "/category" });
    fastify.register(video, { prefix: "/videos" });
    fastify.register(tags, { prefix: "/tags" });
    done();
}
