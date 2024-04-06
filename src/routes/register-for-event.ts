import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { request } from "http";
import { z } from 'zod'
import { prisma } from "../lib/prisma";

export async function registerForEvent (app: FastifyInstance){
    app
    .withTypeProvider<ZodTypeProvider>()
    .post('/events/:eventId/attendees', {
        schema: {
            body: z.object({
                name: z.string().min(4),
                email: z.string().email(),

            }),
            params: z.object({
                eventId: z.string().uuid(),
            }),
            response: {
                201: z.object({
                    attendeeId: z.number(),
                })
            }
        }
    },async (request, reply)=> {

        const { eventId } = request.params
        const { email, name } = request.body

        //Valida se o Email já existe nos events e retorna o erro
        const attendeeFromEmail = await prisma.attendee.findUnique({
            where: {
                eventId_email: {email,eventId}
            }
        })
        if(attendeeFromEmail !== null){
            throw new Error('This e-mail is already registered for this event')
        }

        const [event, amountOfAttendeesForEvent] = await Promise.all([
            //Busca o event de acordo com o eventId passado
            prisma.event.findUnique({
                where: {id: eventId}
            }),

            //Busca a quantidade de attendee
            prisma.attendee.count({
                where: {eventId,}
            })
        ])

        //Retorna um erro caso o numero de participantes chegou ao fim 
        if(event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees){
            throw new Error('The maximum number of attendees for this event has been reached')
        }


        //Cria o registro dentro da table
        const attendee = await prisma.attendee.create({
            data: {
                name,
                email,
                eventId
            }
        })

        return reply.status(201).send({attendeeId: attendee.id})
    })
}