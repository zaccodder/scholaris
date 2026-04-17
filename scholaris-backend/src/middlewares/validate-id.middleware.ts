import isValidUUID from '@/utils/validate-id.js'
import type { NextFunction, Request, Response } from 'express'

export const validateIdParam = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.params.id || !isValidUUID(req.params.id)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid id parameter',
    })
  }

  next()
}
