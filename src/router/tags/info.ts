import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import Tag from "../../schema/tag";
import { tagsCl } from "../../lib/db";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (err?: Error) => void
) {
    fastify.get(
        "/:tagName",
        async (req: FastifyRequest<{ Params: { tagName: string } }>, res) => {
            const { tagName } = req.params;

            const tag = await tagsCl.findOne({ tagName }, { projection: { _id: 0 } }) as Tag;
            if (!tag)
                return res.code(404).send({ success: false, error: "Tag not found." });

            res.send({ success: true, tag });
        }
    );
    done();
}
