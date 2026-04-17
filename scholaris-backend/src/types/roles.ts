export const ROLES = [
  'admin',
  'manager',
  'teacher',
  'student',
  'parent',
] as const

export type Role = (typeof ROLES)[number]
