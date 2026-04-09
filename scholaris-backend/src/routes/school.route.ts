import { createSchool } from "@/controllers/school.controller.js";
import { authenticate, authRole } from "@/middlewares/auth.middleware.js";
import { bodySchema } from "@/middlewares/body-parser.middleware.js";
import { schoolSchema } from "@/validators/school.validator.js";
import express from "express";

const schoolRouter = express.Router();

schoolRouter.post(
  "/",
  [authenticate, authRole("school", ["create"]), bodySchema(schoolSchema)],
  createSchool,
);

export default schoolRouter;
