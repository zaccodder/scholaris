import { auth } from '@/lib/auth.js'
import { fromNodeHeaders } from 'better-auth/node'
import type { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export const getLoggedInUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sess = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!sess) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ success: false, message: 'Not logged in' })
  }

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: 'User logged in', data: sess })
}
