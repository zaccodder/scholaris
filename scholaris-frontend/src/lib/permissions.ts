import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"

// ─── Statements ──────────────────────────────────────────────────────────────
// Every resource in your schema gets listed here with its possible actions.
// Use `as const` — TypeScript needs the literal types for role inference.

const statement = {
  ...defaultStatements,

  // school-level management
  school: ["create", "read", "update", "delete"],

  // people
  teacher: ["create", "read", "update", "delete"],
  student: ["create", "read", "update", "delete"],
  guardian: ["create", "read", "update", "delete"],

  // academic structure
  department: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  class: ["create", "read", "update", "delete"],

  // student activity
  enrollment: ["create", "read", "update", "delete"],
  grade: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],

  // reports
  report: ["read", "export"],
} as const

export const ac = createAccessControl(statement)

// ─── Roles ───────────────────────────────────────────────────────────────────

/**
 * Full system access. Can manage users, schools, all academic data.
 * Merges better-auth's built-in admin statements (ban, impersonate, etc.)
 */
export const adminRole = ac.newRole({
  ...adminAc.statements,
  school: ["create", "read", "update", "delete"],
  teacher: ["create", "read", "update", "delete"],
  student: ["create", "read", "update", "delete"],
  guardian: ["create", "read", "update", "delete"],
  department: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  class: ["create", "read", "update", "delete"],
  enrollment: ["create", "read", "update", "delete"],
  grade: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],
  report: ["read", "export"],
})

/**
 * Day-to-day school operations. Can manage staff, students, classes and
 * academic records but cannot delete the school or manage system users.
 */
export const managerRole = ac.newRole({
  school: ["read", "update"],
  teacher: ["create", "read", "update", "delete"],
  student: ["create", "read", "update", "delete"],
  guardian: ["create", "read", "update", "delete"],
  department: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
  class: ["create", "read", "update", "delete"],
  enrollment: ["create", "read", "update", "delete"],
  grade: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],
  report: ["read", "export"],
})

/**
 * Can manage their own classes: post grades, mark attendance, read
 * student profiles. Cannot touch school settings or other teachers' classes.
 */
export const teacherRole = ac.newRole({
  school: ["read"],
  teacher: ["read"],
  student: ["read"],
  guardian: ["read"],
  department: ["read"],
  course: ["read"],
  class: ["read", "update"],
  enrollment: ["read"],
  grade: ["create", "read", "update", "delete"],
  attendance: ["create", "read", "update", "delete"],
  report: ["read"],
})

/**
 * Read-only access to their own academic profile: classes, grades,
 * attendance. Cannot see other students or modify any records.
 */
export const studentRole = ac.newRole({
  school: ["read"],
  course: ["read"],
  class: ["read"],
  enrollment: ["read"],
  grade: ["read"],
  attendance: ["read"],
  report: ["read"],
})

/**
 * Read-only access to their child's profile: enrollment, grades,
 * attendance. Cannot modify anything.
 */
export const parentRole = ac.newRole({
  student: ["read"],
  enrollment: ["read"],
  grade: ["read"],
  attendance: ["read"],
  report: ["read"],
})
