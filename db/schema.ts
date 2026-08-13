import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * One compact, versioned learner-state document per authenticated ChatGPT user.
 * The user ID is supplied by the Sites dispatcher and is never accepted from
 * the browser as an ownership key.
 */
export const learnerProgress = sqliteTable("learner_progress", {
  userId: text("user_id").primaryKey(),
  stateJson: text("state_json").notNull(),
  schemaVersion: integer("schema_version").notNull().default(1),
  revision: integer("revision").notNull().default(1),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
