import { posts } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PostShowProps {
  postId: string;
}

export default async function PostShow({ postId }: PostShowProps) {
  const postsResult = await db.select().from(posts).where(eq(posts.id, postId));
  const post = postsResult[0];

  if (!post) {
    notFound();
  }

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
        Title : {post.title}
      </h1>

      <div className="prose max-w-none text-gray-800 bg-gray-50 p-6 rounded-lg shadow-sm">
        Content : {post.content}
      </div>
    </article>
  );
}
