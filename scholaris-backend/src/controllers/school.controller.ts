import db from "@/drizzle/db.js";
import { auth } from "@/lib/auth.js";
import type { Request, Response } from "express";

export const createSchool = async (req: Request, res: Response) => {
  const user = req.user;

  console.log(user);

  const schoolExist = await db.query.schools.findFirst({});
};
