// bodySchema.ts
import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'

export const bodySchema = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error.flatten(),
      })
    }

    req.body = result.data // replace body with coerced/transformed data
    next()
  }
}
