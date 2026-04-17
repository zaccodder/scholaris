import express from 'express'
import {
  createSchool,
  deleteSchoolById,
  getSchoolById,
  updateSchoolById,
} from '@/controllers/school.controller.js'
import { authenticate, authRole } from '@/middlewares/auth.middleware.js'
import { bodySchema } from '@/middlewares/body-parser.middleware.js'
import { validateIdParam } from '@/middlewares/validate-id.middleware.js'
import { schoolSchema } from '@/validators/school.validator.js'

const schoolRouter = express.Router()

schoolRouter.post(
  '/',
  [authenticate, authRole('school', ['read']), bodySchema(schoolSchema)],
  createSchool,
)
schoolRouter.get(
  '/:id',
  [authenticate, authRole('school', ['read']), validateIdParam],
  getSchoolById,
)

schoolRouter.put(
  '/:id',
  [
    authenticate,
    authRole('school', ['update']),
    bodySchema(schoolSchema),
    validateIdParam,
  ],
  updateSchoolById,
)

schoolRouter.delete(
  '/:id',
  [authenticate, authRole('school', ['delete'])],
  deleteSchoolById,
)

export default schoolRouter
