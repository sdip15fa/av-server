import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { genUserId } from "../../lib/genId";
import { ajv } from "../../lib/ajv";
import bcrypt from "bcrypt";
import { usersCl } from "../../lib/db";
import User from "../../schema/user";
import { createToken } from "../../lib/auth";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const schema = Type.Object(
        {
            userName: Type.String({ maxLength: 20, minLength: 1 }),
            email: Type.String({ format: "email" }),
            password: Type.String({ minLength: 8 }),
        },
        { additionalProperties: false }
    );

    fastify.post(
        "/register",
        async (req: FastifyRequest<{ Body: Static<typeof schema> }>, res) => {
            if (!ajv.validate(schema, req.body))
                return res.code(400).send({ success: false, error: "Bad request." });

            const { userName, email } = req.body;

            if (await usersCl.findOne({ $or: [{ userName }, { email }] }))
                return res
                    .code(409)
                    .send({ success: false, error: "Username or email already in use." });

            const password = bcrypt.hashSync(req.body.password, 10);
            const userId = await genUserId();

            const userObj: User = {
                userId,
                userName,
                email,
                password,
                creationTime: new Date(),
                role: Number(userId) === 1 ? "admin" : "user",
            };

            await usersCl.insertOne(userObj);

            res.send({ success: true, token: createToken(userObj) });
        }
    );

    done();
}
