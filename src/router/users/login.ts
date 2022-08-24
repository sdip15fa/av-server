import { Static, Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { usersCl } from "../../lib/db";
import { ajv } from "../../lib/ajv";
import bcrypt from "bcrypt";
import { createToken } from "../../lib/auth";
import User from "../../schema/user";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    const schema = Type.Object(
        {
            email: Type.String({ format: "email" }),
            password: Type.String({ minLength: 8 }),
        },
        { additionalProperties: false }
    );

    fastify.post(
        "/login",
        async (req: FastifyRequest<{ Body: Static<typeof schema> }>, res) => {
            if (!ajv.validate(schema, req.body))
                return res.code(400).send({ success: false, error: "Bad request." });

            const { email, password } = req.body;

            const user = (await usersCl.findOne({ email })) as User;

            if (!user)
                return res.code(404).send({ success: false, error: "User not found." });

            if (!bcrypt.compareSync(password, user.password))
                return res
                    .code(401)
                    .send({ success: false, error: "Password incorrect." });

            res.send({ success: true, token: createToken(user) });
        }
    );

    done();
}
