import { CustomError } from '@/errors/index.js'
import logger from '@/lib/winston.js'
import type { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { ZodError } from 'zod'

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CustomError) {
    logger.error(err)
    return res
      .status(err.statusCode)
      .json({ success: false, error: err.message })
  } else if (err instanceof ZodError) {
    logger.error(err)
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      error: err.issues.map((issue) => issue.message),
    })
  }

  logger.error(err)
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ success: false, error: 'Internal Server Error' })
}

export default errorHandler
