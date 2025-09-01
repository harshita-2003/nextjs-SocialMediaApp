import { sql } from "drizzle-orm";
import { sqliteTable, text, integer,primaryKey,uniqueIndex,foreignKey } from "drizzle-orm/sqlite-core";
 
// export const users = sqliteTable("users", {
//   id: integer("id").primaryKey({ autoIncrement: true }),
//   name: text("name").notNull(),
//   email: text("email").notNull().unique(),
// });
 
export const snippet = sqliteTable("snippet",{
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  code: text("code").notNull(),
});
 
// ------------------ User ------------------
export const users = sqliteTable("User", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique().notNull(),
  emailVerified: integer("emailVerified", { mode: "timestamp" }),
  image: text("image"),
});
 
// ------------------ Account ------------------
export const account = sqliteTable(
  "Account",
  {
    id: text("id").$defaultFn(()=>crypto.randomUUID()),
    userId: text("userId").notNull(),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => {
    return {
      compositePk: primaryKey({
        columns: [table.provider, table.providerAccountId],
      }),
      fk_user: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
      }).onDelete("cascade"),
    };
  }
);
 
// ------------------ Session ------------------
export const sessions = sqliteTable("Session", {
  // id: text("id")
  //   .primaryKey()
  //   .$defaultFn(() => crypto.randomUUID()),
  sessionToken: text("sessionToken").unique().notNull(),
  userId: text("userId").notNull().references(()=>users.id,{onDelete: "cascade"}),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});
 
// ------------------ VerificationToken ------------------
export const verificationTokens = sqliteTable(
  "VerificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").unique().notNull(),
    expires: integer("expires", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    identifierTokenUnique: primaryKey({
      columns: [table.identifier, table.token],
    }),
  })
);
 
// ------------------ Topic ------------------
export const topics = sqliteTable("Topic", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  slug: text("slug").unique().notNull(),
  description: text("description").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
 
// ------------------ Post ------------------
export const posts = sqliteTable("Post", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  topicId: text("topicId")
    .notNull()
    .references(() => topics.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
 
// ------------------ Comment ------------------
export const comments:any = sqliteTable("Comment", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  content: text("content").notNull(),
  postId: text("postId")
    .notNull()
    .references(() => posts.id, { onDelete: "cascade" }),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: text("parentId").references(() => comments.id, { onDelete: "cascade" }),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});