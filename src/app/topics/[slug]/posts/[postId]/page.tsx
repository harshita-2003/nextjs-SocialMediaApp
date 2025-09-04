import Link from "next/link";
import PostShow from "@/components/posts/post-show";
import CommentList from "@/components/comments/comment-list";
import CommentCreateForm from "@/components/comments/comment-create-form";
import paths from "@/paths";
import { fetchCommentsByPostId } from "@/db/queries/comments";
import { Suspense } from "react";
import PostShowLoading from "@/components/posts/post-show-loading";

interface PostShowPageProps {
  params: Promise<{
    slug: string;
    postId: string;
  }>;
}

export default async function PostShowPage({ params }: PostShowPageProps) {
  const { slug, postId } = await params;

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Back to Topic Link */}
      <div>
        <Link
          href={paths.topicShow(slug)}
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          &larr; Back to <span className="font-medium">{slug}</span>
        </Link>
      </div>

      {/* Post Content */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <Suspense fallback={<PostShowLoading />}>
          <PostShow postId={postId} />
        </Suspense>
      </section>

      {/* Comment Form */}
      <section className="bg-gray-50 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Add a Comment
        </h2>
        <CommentCreateForm postId={postId} startOpen />
      </section>

      {/* Comments List */}
      <section>
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Comments
        </h2>
        <div className="space-y-4">
          <CommentList fetchData={() => fetchCommentsByPostId(postId)} />
        </div>
      </section>
    </main>
  );
}
