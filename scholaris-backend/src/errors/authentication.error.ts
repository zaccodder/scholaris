import { StatusCodes } from 'http-status-codes'
import CustomError from './custom.error.js'

class AuthenticationError extends CustomError {
  constructor(message: string) {
    super(message, StatusCodes.UNAUTHORIZED)
    this.name = 'AuthenticationError'
  }
}

export default AuthenticationError
