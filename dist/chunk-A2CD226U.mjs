import {
  BadRequest
} from "./chunk-JRO4E4TH.mjs";
import {
  prisma
} from "./chunk-JV6GRE7Y.mjs";

// src/routes/check-in.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get("/attendees/:attendeeId/check-in", {
    schema: {
      summary: "Create an Check-in",
      tags: ["check-ins"],
      params: z.object({
        attendeeId: z.coerce.number().int()
      }),
      response: {
        201: z.null()
      }
    }
  }, async (req, res) => {
    const { attendeeId } = req.params;
    const attendeeExistes = await prisma.attendee.findUnique({
      where: {
        id: attendeeId
      }
    });
    const attendeeCheckIn = await prisma.checkIn.findUnique({
      where: {
        attendeeId
      }
    });
    if (!attendeeExistes) {
      throw new BadRequest("Attendee not exists!");
    }
    if (attendeeCheckIn !== null) {
      throw new BadRequest("Attendee already checked in!");
    }
    await prisma.checkIn.create({
      data: {
        attendeeId
      }
    });
    return res.status(201).send();
  });
}

export {
  checkIn
};
