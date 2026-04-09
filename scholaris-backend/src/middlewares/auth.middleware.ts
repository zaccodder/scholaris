import { auth } from "@/lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sess = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  if (!sess) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  req.user = sess.user;
  req.session = sess.session;

  next();
};

export const authRole = (resource: string, actions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const result = await auth.api.userHasPermission({
      body: {
        userId: req.user.id,
        permissions: {
          [resource]: actions,
        },
      },
    });

    if (result.error) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  };
};
