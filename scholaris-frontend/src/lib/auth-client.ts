import { createAuthClient } from "better-auth/client"
import { adminClient } from "better-auth/client/plugins"
import {
  ac,
  adminRole,
  managerRole,
  teacherRole,
  studentRole,
  parentRole,
} from "./permissions"

export const authClient = createAuthClient({
  baseURL: import.meta.env.SERVER_BASE_URL || "http://localhost:3001",
  plugins: [
    adminClient({
      ac,
      roles: {
        admin: adminRole,
        manager: managerRole,
        teacher: teacherRole,
        student: studentRole,
        parent: parentRole,
      },
    }),
  ],
})
