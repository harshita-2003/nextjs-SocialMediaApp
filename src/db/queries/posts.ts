// import { posts  } from "@/db/schema";
// import { db } from "@/db";
 
// export type PostWithData = typeof posts.$inferSelect & {
//   topic: { slug: string };
//   user: { name: string | null };
//   _count: { comments: number };
// };
 

// export async function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
//     const topic = await db.query.topics.findFirst({
//         where: (topics, { eq }) => eq(topics.slug, slug),
//         columns: { id: true, slug: true },
//     });
    
//     if (!topic) {
//         return [];
//     }
    
//     const rawPosts = await db.query.posts.findMany({
//         where: (posts, { eq }) => eq(posts.topicId, topic.id),
//         with: {
//         topic: {
//             columns: { slug: true }
//         },
//         user: {
//             columns: { name: true }
//         },
//         comments: true, 
//         },
//     });
    
//     // Transform to match Prisma structure
//     return rawPosts.map((post) => ({
//         ...post,
//         topic: { slug: post.topic?.slug || '' },
//         user: { name: post.user?.name || null },
//         _count: { comments: post.comments?.length || 0 },
//         comments: undefined,
//     })) as PostWithData[];
// }
 



import { db } from "@/db";
import { posts, topics, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type PostWithData = typeof posts.$inferSelect & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

export async function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  // Step 1: Get the topic by slug
  const topic = await db.query.topics.findFirst({
    where: (topics, { eq }) => eq(topics.slug, slug),
    columns: { id: true, slug: true },
  });

  if (!topic) return [];

  // Step 2: Get posts under the topic with relations
  const postsWithRelations = await db.query.posts.findMany({
    where: (posts, { eq }) => eq(posts.topicId, topic.id),
    with: {
      topic: {
        columns: { slug: true },
      },
      user: {
        columns: { name: true },
      },
      comments: true, // we’ll use this just to count
    },
  });

  // Step 3: Reshape results
  return postsWithRelations.map((post) => ({
    ...post,
    topic: {
      slug: post.topic.slug,
    },
    user: {
      name: post.user.name ?? null,
    },
    _count: {
      comments: post.comments.length,
    },
  }));
}
