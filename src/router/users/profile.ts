import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { usersCl } from "../../lib/db";
import { ajv } from "../../lib/ajv";
import User from "../../schema/user";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error) => void
) {
    fastify.get(
        "/profile/:userId",
        async (req: FastifyRequest<{ Params: { userId: string } }>, res) => {
            const { userId } = req.params;
            if (!ajv.validate(Type.RegEx(/^\d+$/), userId))
                return res.code(400).send({ success: false, error: "Bad request." });

            const user = (await usersCl.findOne(
                { userId },
                { projection: { _id: 0, password: 0, email: 0 } }
            )) as User;

            if (!user)
                return res.code(404).send({ success: false, error: "User not found." });

            res.send({ success: true, user });
        }
    );
    done();
}
