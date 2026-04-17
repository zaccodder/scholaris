import { StatusCodes } from 'http-status-codes'

class CustomError extends Error {
  readonly statusCode: number
  constructor(
    message: string,
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message)
    this.name = 'CustomError'
    this.statusCode = statusCode
    Object.setPrototypeOf(this, CustomError.prototype)
  }
}

export default CustomError
