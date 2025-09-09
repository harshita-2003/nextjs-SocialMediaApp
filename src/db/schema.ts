import { sql } from "drizzle-orm";
import { sqliteTable, text, integer,primaryKey,foreignKey } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
 
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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
 
 
// ------------------ Relations ------------------
 
// Users
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
  accounts: many(account),
  sessions: many(sessions),
}));
 
// Accounts
export const accountRelations = relations(account, ({ one }) => ({
  user: one(users, {
    fields: [account.userId],
    references: [users.id],
  }),
}));
 
// Sessions
export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
 
// Topics
export const topicsRelations = relations(topics, ({ many }) => ({
  posts: many(posts),
}));
 
// Posts
export const postsRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
  topic: one(topics, {
    fields: [posts.topicId],
    references: [topics.id],
  }),
  comments: many(comments),
}));
 
// Comments
export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  user: one(users, {
    fields: [comments.userId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments), // self-join for nested replies
}));