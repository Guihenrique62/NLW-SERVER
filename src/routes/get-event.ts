import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { request } from "http";
import { string, z } from 'zod'
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .get('/events/:eventId',{
        schema: {
            params: z.object({
                eventId: z.string().uuid()
            }),
        }
    }, async (request, reply)=>{
        const { eventId } = request.params

        //Busca o evento de acordo com o eventId passado
        const event = await prisma.event.findUnique({
            select: {
                id: true,
                title: true,
                slug: true,
                details: true,
                maximumAttendees: true,
                _count: {
                    select: {
                        attendees: true,
                    }
                }
            },
            where: {id: eventId,}
        })

        //Se não houver evento retorna o erro
        if ( event === null){throw new Error('Event not found')}


        //Retorna o objeto formatado para o front
        return reply.status(200).send({
            event: {
                id: event.id,
                title: event.title,
                slug: event.slug,
                details: event.details,
                maximumAttendees: event.maximumAttendees,
                attendeesAmount: event._count.attendees
            }
        })

    })
}