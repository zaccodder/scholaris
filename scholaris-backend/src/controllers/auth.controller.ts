import { auth } from "@/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { Request, Response } from "express";

export const getloggedInUser = async (req: Request, res: Response) => {
  const sess = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!sess) {
    return res.json({ success: false, message: "Not logged in" });
  }
  res.json({ success: true, message: "User logged in", data: sess });
};
