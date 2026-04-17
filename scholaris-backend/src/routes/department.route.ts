import {
  createDepartment,
  getAllDepartments,
  getDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/controllers/department.controller.js'
import { authenticate, authRole } from '@/middlewares/auth.middleware.js'
import { bodySchema } from '@/middlewares/body-parser.middleware.js'
import { validateIdParam } from '@/middlewares/validate-id.middleware.js'
import { departmentSchema } from '@/validators/department.validator.js'
import express from 'express'

const departmentRouter = express.Router()

// department routes

departmentRouter.post(
  '/',
  [
    authenticate,
    authRole('department', ['create']),
    bodySchema(departmentSchema),
  ],
  createDepartment,
)
departmentRouter.get(
  '/',
  [authenticate, authRole('department', ['read'])],
  getAllDepartments,
)
departmentRouter.get(
  '/:id',
  [authenticate, authRole('department', ['read']), validateIdParam],
  getDepartment,
)
departmentRouter.put(
  '/:id',
  [
    authenticate,
    authRole('department', ['update']),
    validateIdParam,
    bodySchema(departmentSchema),
  ],
  updateDepartment,
)
departmentRouter.delete(
  '/:id',
  [authenticate, authRole('department', ['delete']), validateIdParam],
  deleteDepartment,
)

export default departmentRouter
