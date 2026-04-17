import { StatusCodes } from 'http-status-codes'
import CustomError from './custom.error.js'

class BadRequestError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.BAD_REQUEST)
    this.name = 'BadRequestError'
  }
}

export default BadRequestError
