import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generate-slug"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { FastifyInstance } from "fastify"
import { BadRequest } from "./_errors/bad-request"

export async function createEvent(app:FastifyInstance){
    app
        .withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                summary: 'Create an event',
                tags: ['events'],

                //Valida os dados vindos do body
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable(),
                }),

                //Especifica o tipo de resposta esperado
                response: {
                    201: z.object({
                        eventId: z.string().uuid(),
                    })
                }
            }},
        async (request, reply)=> {


            // Atribui os dados já validados
            const {title,maximumAttendees,details} = request.body

            //Gera um slug compativel sem acentos etc
            const slug = generateSlug(title)

            //Valida se o Slug já não existe e retorna o erro
            const eventWithSameSlug = await prisma.event.findUnique({where: {slug}})
            if (eventWithSameSlug !== null) {
                throw new BadRequest('Another event with same title already exists')
            }

            //Cria o registro dentro da table event
            const event = await prisma.event.create({
                data: {
                    title,
                    details,
                    maximumAttendees,
                    slug: slug
                }
            })

            return reply.status(201).send( {eventId: event.id} )
    })
}