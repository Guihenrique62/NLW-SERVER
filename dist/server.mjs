import {
  registerForEvent
} from "./chunk-B2WBEISJ.mjs";
import {
  errorHandler
} from "./chunk-EOXGF5FC.mjs";
import {
  checkIn
} from "./chunk-A2CD226U.mjs";
import {
  createEvent
} from "./chunk-BULOJ3QC.mjs";
import "./chunk-P5DM3TRB.mjs";
import {
  getAttendeeBadge
} from "./chunk-JIUTFAHG.mjs";
import {
  getEventAttendees
} from "./chunk-DMUPZBXT.mjs";
import {
  getEvent
} from "./chunk-ONSOKROY.mjs";
import "./chunk-JRO4E4TH.mjs";
import "./chunk-JV6GRE7Y.mjs";

// src/server.ts
import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyCors from "@fastify/cors";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
var app = fastify();
app.register(fastifyCors, {
  origin: "*"
});
app.register(fastifySwagger, {
  swagger: {
    consumes: ["application/json"],
    produces: ["application/json"],
    info: {
      title: "pass.in",
      description: "Especifica\xE7\xF5es da API para o back-end da aplica\xE7\xE3o pass.in constru\xEDda por Guilherme Henrique",
      version: "1.0.0"
    }
  },
  transform: jsonSchemaTransform
});
app.register(fastifySwaggerUi, {
  routePrefix: "/docs"
});
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);
app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);
app.setErrorHandler(errorHandler);
app.listen({ port: 3333, host: "0.0.0.0" }).then(() => {
  console.log("HTTP server running");
});
