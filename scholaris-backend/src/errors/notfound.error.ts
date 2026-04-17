import { StatusCodes } from 'http-status-codes'
import CustomError from './custom.error.js'

class NotFoundError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.NOT_FOUND)
    this.name = 'NotFoundError'
  }
}

export default NotFoundError
