import { getloggedInUser } from "@/controllers/auth.controller.js";
import express from "express";

const authRouter = express.Router();

authRouter.get("/", getloggedInUser);

export default authRouter;
