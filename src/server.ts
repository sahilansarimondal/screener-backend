import fastify, { FastifyInstance } from "fastify";
import { db } from "./db/client";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";

const server: FastifyInstance = fastify({
  logger: false,
});

server.get("/", async (request, reply) => {
  return { message: "Hello, Fastify with Typescript and Drizzle ORM" };
});

server.get("/users", async () => {
  const allUsers = await db.select().from(users);
  return allUsers;
});

server.post<{ Body: { name: string; email: string } }>(
  "/user",
  async (request, reply) => {
    const { name, email } = request.body;
    const newUser = await db.insert(users).values({ name, email }).returning();
    reply.code(201).send(newUser);
  }
);

server.get<{ Params: { id: number } }>("/user/:id", async (request, reply) => {
  const { id } = request.params;
  const user = await db.select().from(users).where(eq(users.id, id));
  return user[0] || { error: "User not found" };
});

const start = async () => {
  try {
    await server.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running at http://localhost:3001");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

start();
