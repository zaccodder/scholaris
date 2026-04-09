import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  varchar,
  date,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const enrollmentStatusEnum = pgEnum("enrollment_status", [
  "active",
  "dropped",
  "completed",
  "suspended",
]);

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
  "excused",
]);

export const classScheduleEnum = pgEnum("class_schedule", [
  "monday_wednesday_friday",
  "tuesday_thursday",
  "monday_to_friday",
  "weekend",
]);

export const semesterEnum = pgEnum("semester", ["first", "second", "summer"]);

// ─── Tables ──────────────────────────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_userId_idx").on(table.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

export const verification = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const schools = pgTable("school", {
  id: text("id").primaryKey().notNull(),
  name: text("name").unique().notNull(),
  ownerId: text("owner_id")
    .references(() => user.id)
    .notNull(),
  phone: text("phone"),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const departments = pgTable("department", {
  id: text("id").primaryKey().notNull(),
  schoolId: text("school_id")
    .references(() => schools.id)
    .notNull(),
  name: varchar("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const teachers = pgTable("teacher", {
  id: text("id").primaryKey().notNull(),
  schoolId: text("school_id")
    .references(() => schools.id)
    .notNull(),
  firstname: varchar("first_name").notNull(),
  lastname: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone", { length: 11 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const guardians = pgTable("guardian", {
  id: text("id").primaryKey().notNull(),
  firstname: varchar("first_name").notNull(),
  lastname: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone", { length: 11 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const students = pgTable("student", {
  id: text("id").primaryKey().notNull(),
  schoolId: text("school_id")
    .references(() => schools.id)
    .notNull(),
  guardianId: text("guardian_id").references(() => guardians.id),
  firstname: varchar("first_name").notNull(),
  lastname: varchar("last_name").notNull(),
  email: varchar("email").unique().notNull(),
  dateOfBirth: date("date_of_birth"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const courses = pgTable("course", {
  id: text("id").primaryKey().notNull(),
  schoolId: text("school_id")
    .references(() => schools.id)
    .notNull(),
  departmentId: text("department_id").references(() => departments.id),
  name: varchar("name").notNull(),
  description: varchar("description").notNull(),
  credits: integer("credits"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const classes = pgTable("class", {
  id: text("id").primaryKey().notNull(),
  courseId: text("course_id")
    .references(() => courses.id)
    .notNull(),
  teacherId: text("teacher_id").references(() => teachers.id),
  roomNumber: text("room_number"),
  semester: semesterEnum("semester"),
  year: integer("year"),
  schedule: classScheduleEnum("schedule"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const enrollments = pgTable("enrollment", {
  id: text("id").primaryKey().notNull(),
  studentId: text("student_id")
    .references(() => students.id)
    .notNull(),
  classId: text("class_id")
    .references(() => classes.id)
    .notNull(),
  enrollmentDate: date("enrollment_date").defaultNow(),
  status: enrollmentStatusEnum("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const grades = pgTable("grade", {
  id: text("id").primaryKey().notNull(),
  enrollmentId: text("enrollment_id")
    .references(() => enrollments.id)
    .notNull(),
  assignmentName: text("assignment_name"),
  score: decimal("score"),
  maxScore: decimal("max_score"),
  gradeDate: date("graded_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const attendance = pgTable("attendance", {
  id: text("id").primaryKey().notNull(),
  enrollmentId: text("enrollment_id")
    .references(() => enrollments.id)
    .notNull(),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  school: one(user),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const schoolsRelations = relations(schools, ({ many }) => ({
  departments: many(departments),
  teachers: many(teachers),
  students: many(students),
  courses: many(courses),
}));

export const departmentsRelations = relations(departments, ({ one, many }) => ({
  school: one(schools, {
    fields: [departments.schoolId],
    references: [schools.id],
  }),
  courses: many(courses),
}));

export const teachersRelations = relations(teachers, ({ one, many }) => ({
  school: one(schools, {
    fields: [teachers.schoolId],
    references: [schools.id],
  }),
  classes: many(classes),
}));

export const guardiansRelations = relations(guardians, ({ many }) => ({
  students: many(students),
}));

export const studentsRelations = relations(students, ({ one, many }) => ({
  school: one(schools, {
    fields: [students.schoolId],
    references: [schools.id],
  }),
  guardian: one(guardians, {
    fields: [students.guardianId],
    references: [guardians.id],
  }),
  enrollments: many(enrollments),
}));

export const coursesRelations = relations(courses, ({ one, many }) => ({
  school: one(schools, {
    fields: [courses.schoolId],
    references: [schools.id],
  }),
  department: one(departments, {
    fields: [courses.departmentId],
    references: [departments.id],
  }),
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  course: one(courses, {
    fields: [classes.courseId],
    references: [courses.id],
  }),
  teacher: one(teachers, {
    fields: [classes.teacherId],
    references: [teachers.id],
  }),
  enrollments: many(enrollments),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  class: one(classes, {
    fields: [enrollments.classId],
    references: [classes.id],
  }),
  grades: many(grades),
  attendance: many(attendance),
}));

export const gradesRelations = relations(grades, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [grades.enrollmentId],
    references: [enrollments.id],
  }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  enrollment: one(enrollments, {
    fields: [attendance.enrollmentId],
    references: [enrollments.id],
  }),
}));
