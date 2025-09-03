import { db } from "@/db";
import { posts, topics, users, comments } from "@/db/schema";
import { count, desc, eq, like, or } from "drizzle-orm";

export type PostWithData = typeof posts.$inferSelect & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};


export async function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  // Step 1: Get the topic ID for the given slug
  const topic = await db.query.topics.findFirst({
    where: (topics, { eq }) => eq(topics.slug, slug),
    columns: { id: true, slug: true },
  });

  if (!topic) return [];

  // Step 2: Select posts under the topic, join with user, topic, and count comments
  const rows = await db
    .select({
      post: posts,
      userName: users.name,
      topicSlug: topics.slug,
      commentCount: count(comments.id).as("commentCount"),
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.userId))
    .leftJoin(topics, eq(topics.id, posts.topicId))
    .leftJoin(comments, eq(comments.postId, posts.id))
    .where(eq(posts.topicId, topic.id))
    .groupBy(posts.id, users.name, topics.slug);

  // Step 3: Reshape result to match PostWithData
  return rows.map(row => ({
    ...row.post,
    user: {
      name: row.userName,
    },
    topic: {
      slug: row.topicSlug!,
    },
    _count: {
      comments: row.commentCount ?? 0,
    },
  }));
}


export async function fetchTopPosts() : Promise<PostWithData[]> {
  const rows = await db
    .select({
      post: posts,
      userName: users.name,
      topicSlug: topics.slug,
      commentCount: count(comments.id),
    })
    .from(posts)
    .leftJoin(comments, eq(comments.postId, posts.id))
    .leftJoin(users, eq(users.id, posts.userId))
    .leftJoin(topics, eq(topics.id, posts.topicId))
    .groupBy(posts.id, users.name, topics.slug)
    .orderBy(desc(count(comments.id)))
    .limit(5);

  return rows.map(row => ({
    ...row.post,
    user: {
      name: row.userName,
    },
    topic: {
      slug: row.topicSlug!,
    },
    _count: {
      comments: row.commentCount,
    },
  }));
}

export async function fetchPostsBySearchTerm(term: string): Promise<PostWithData[]> {
  const rows = await db
    .select({
      post: posts,
      userName: users.name,
      userImage: users.image,
      topicSlug: topics.slug,
      commentCount: count(comments.id).as("commentCount"),
    })
    .from(posts)
    .leftJoin(users, eq(users.id, posts.userId))
    .leftJoin(topics, eq(topics.id, posts.topicId))
    .leftJoin(comments, eq(comments.postId, posts.id))
    .where(
      or(
        like(posts.title, `%${term}%`),
        like(posts.content, `%${term}%`)
      )
    )
    .groupBy(posts.id, users.name, users.image, topics.slug);

  return rows.map(row => ({
    ...row.post,
    user: {
      name: row.userName,
      image: row.userImage,
    },
    topic: {
      slug: row.topicSlug!,
    },
    _count: {
      comments: row.commentCount ?? 0,
    },
  }));
}
