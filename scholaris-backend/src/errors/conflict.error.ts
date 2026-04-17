import { StatusCodes } from 'http-status-codes'
import CustomError from './custom.error.js'

class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.CONFLICT)
    this.name = 'ConflictError'
  }
}

export default ConflictError
