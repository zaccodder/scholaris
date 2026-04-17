import z from 'zod'

export const schoolSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  email: z.string().trim().email(),
})
