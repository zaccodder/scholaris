import z from 'zod'

export const courseSchema = z.object({
  name: z.string().trim().min(4).max(100),
  schoolId: z.string().uuid('schoolId must be a valid UUID'),
  departmentId: z.string().uuid('departmentId must be a valid UUID'),
  description: z.string().trim().min(20).max(2000),
  credits: z.number().int().positive().optional(),
})
