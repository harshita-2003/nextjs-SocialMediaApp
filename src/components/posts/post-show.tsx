import { posts } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface PostShowProps {
  postId : string
}

export default async function PostShow({postId}: PostShowProps) {

  const postsResult = await db.select().from(posts).where(eq(posts.id, postId))
  const post = postsResult[0];

  if(!post) {
    notFound();
  }

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold my-2">{post.title}</h1>
      <p className="p-4 border rounded">{post.content}</p>
    </div>
  );
}
