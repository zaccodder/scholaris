import type {
  classes,
  courses,
  departments,
  schools,
} from '@/drizzle/schema.ts'
import type { Session } from 'better-auth'
import type { UserWithRole } from 'better-auth/plugins'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'

declare global {
  namespace Express {
    interface Request {
      user?: UserWithRole | null
      session?: Session | null
    }
  }
}

export type School = Omit<
  InferSelectModel<typeof schools>,
  'id' | 'createdAt' | 'updatedAt' | 'ownerId'
>

export type Department = Omit<
  InferSelectModel<typeof departments>,
  'id' | 'createdAt' | 'updatedAt'
>

export const ROLES = [
  'admin',
  'manager',
  'teacher',
  'student',
  'parent',
] as const
export type Role = (typeof ROLES)[number]
export type Course = Omit<
  InferSelectModel<typeof courses>,
  'id' | 'updatedAt' | 'createdAt'
>

export type Class = Omit<
  InferSelectModel<typeof classes>,
  'id' | 'updatedAt' | 'createdAt'
>

export {}
