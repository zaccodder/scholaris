import z from 'zod'

export const classSchema = z.object({
  courseId: z.string().uuid('courseId must be a valid UUID'),
  roomNumber: z.string().optional(),
  schedule: z.enum([
    'monday_wednesday_friday',
    'tuesday_thursday',
    'monday_to_friday',
    'weekend',
  ]),
  semester: z.enum(['first', 'second', 'summer']),
  teacherId: z.string().uuid('teacherId must be a valid UUID').optional(),
  year: z.number().int().min(2000).max(2100),
})
