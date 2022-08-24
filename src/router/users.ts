import { FastifyInstance, FastifyPluginOptions } from "fastify";
import register from "./users/register";
import login from "./users/login";
import profile from "./users/profile";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.register(register);
    fastify.register(login);
    fastify.register(profile);
    done();
}
