import { toNodeHandler } from "better-auth/node";
import express, { type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { auth } from "@/lib/auth.js";
import authRouter from "./routes/auth.route.js";
import schoolRouter from "./routes/school.route.js";
import unknownEndPoint from "./middlewares/unknown-end-point.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.use(
  cors({
    origin: process.env.BETTER_AUTH_URL,
    methods: ["POST", "GET", "PATCH", "UPDATE", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
app.use(morgan("dev"));
app.use(helmet());

// Test route
app.get("/health", async (req: Request, res: Response) => {
  res.send("Scholaris backend server is running healthy");
});

// application routes
app.use("/api/v1/user", authRouter);
app.use("/api/v1/school", schoolRouter);

app.use("*", unknownEndPoint);
// error handler middleware
app.use(errorHandler);

export default app;
