import type { schools } from "@/drizzle/schema.ts";
import type { Session, User } from "better-auth";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";

declare global {
  namespace Express {
    interface Request {
      user?: User | null;
      session?: Session | null;
    }
  }
}

export type School = Omit<
  InferInsertModel<typeof schools>,
  "id" | "createdAt" | "updatedAt"
>;

export {};
