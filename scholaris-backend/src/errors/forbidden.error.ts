import { StatusCodes } from 'http-status-codes'
import CustomError from './custom.error.js'

class ForbiddenError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.FORBIDDEN)
    this.name = 'ForbiddenError'
  }
}

export default ForbiddenError
