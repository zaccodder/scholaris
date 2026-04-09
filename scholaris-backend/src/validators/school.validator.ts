import z from "zod";

export const schoolSchema = z.object({
  name: z.string().min(2),
  ownerId: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
});
