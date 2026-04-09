import { betterAuth } from "better-auth";
import { admin as adminPlugin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "@/drizzle/db.js";
import * as schema from "@/drizzle/schema.js";
import {
  ac,
  adminRole,
  managerRole,
  teacherRole,
  studentRole,
  parentRole,
} from "@/utils/permissions.js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: { enabled: true },

  plugins: [
    adminPlugin({
      ac,
      roles: {
        admin: adminRole,
        manager: managerRole,
        teacher: teacherRole,
        student: studentRole,
        parent: parentRole,
      },
      // Roles that can call admin-level API endpoints (ban, impersonate, etc.)
      adminRoles: ["admin", "manager"],
      defaultRole: "student",
    }),
  ],

  user: {
    additionalFields: {
      // Stored on the user row — not input by the user themselves
      role: {
        type: "string",
        defaultValue: "student",
        input: false,
        returned: true,
      },
    },
  },
});
