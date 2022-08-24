import Fastify from "fastify";
import dotenv from "dotenv";
import router from "./router";
import cors from "@fastify/cors";
import { client, tagsCl, usersCl, videosCl } from "./lib/db";
import { createToken, verifyToken } from "./lib/auth";
import { jwtType } from "./schema/user";
import { ajv } from "./lib/ajv";

dotenv.config();

function build() {
    const fastify = Fastify({
        logger: true,
    });

    fastify.setValidatorCompiler((opt) => ajv.compile(opt.schema));

    fastify.addHook("preHandler", (req, res, done) => {
        const token = req.headers.authorization;
        const user = verifyToken(token) as jwtType & { exp: number };
        if (user) {
            const { exp } = user;
            if (
                new Date(exp).getTime() - 60 * 60 * 24 * 7 <
                new Date().getTime() - 60 * 60
            )
                res.header("token", createToken(user));
        }
        done()
    });

    fastify.register(cors);
    fastify.register(router, { prefix: "/api" });

    return fastify;
}

client
    .connect()
    .then(async () => {
        await videosCl.createIndex({ videoDisplayName: "text" });
        await videosCl.createIndex({ videoId: 1 });
        await usersCl.createIndex({ userId: 1 });
        await tagsCl.createIndex({ tagName: 1 });

        const fastify = build();

        fastify.listen(
            { port: Number(process.env.APP_PORT || 3000), host: "0.0.0.0" },
            (err) => {
                if (err) throw err;
                console.log(`server listening on ${process.env.APP_PORT || 3000}`);
            }
        );
    })
    .catch((err) => {
        throw err;
    });
