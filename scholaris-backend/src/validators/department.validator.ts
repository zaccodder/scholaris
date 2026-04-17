import { z } from 'zod'

export const departmentSchema = z.object({
  schoolId: z.string().uuid('schoolId must be a valid UUID'),
  name: z.string().trim().min(3).max(100),
})
