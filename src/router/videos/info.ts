import { Type } from "@sinclair/typebox";
import { FastifyInstance, FastifyPluginOptions, FastifyRequest } from "fastify";
import { videosCl } from "../../lib/db";
import Video from "../../schema/video";
import { ajv } from "../../lib/ajv";

export default function (
    fastify: FastifyInstance,
    opts: FastifyPluginOptions,
    done: (e?: Error) => void
) {
    fastify.get("/:videoId", async (req: FastifyRequest<{ Params: { videoId: string } }>, res) => {
        const { videoId } = req.params;
        if (!ajv.validate(Type.RegEx(/^\d+$/), videoId))
            return res.code(400).send({ success: false, error: "Bad request." });

        const video = (await videosCl.findOne(
            { videoId },
            { projection: { _id: 0 } }
        )) as Video;

        if (!video)
            return res.code(404).send({ success: false, error: "Video not found." });

        await videosCl.updateOne({ videoId }, { $inc: { viewCount: 1 } });

        res.send({ success: true, video });
    });
    done();
}
