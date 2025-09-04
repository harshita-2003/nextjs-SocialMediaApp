import Link from 'next/link';
import paths from '@/paths';
import type { PostWithData } from '@/db/queries/posts'

interface PostListProps {
  fetchData : () => Promise<PostWithData[]>
}

// TODO: Get list of posts into this component somehow
export default async function PostList({ fetchData }: PostListProps) {

  const posts = await fetchData();

  const renderedPosts = posts.map((post) => {
    const topicSlug = post.topic.slug;

    if (!topicSlug) {
      throw new Error('Need a slug to link to a post');
    }

    return (
      <div
        key={post.id}
        className="border border-gray-300 rounded-md p-5 mb-5 hover:shadow-lg transition-shadow duration-300 bg-white"
      >
        <Link href={paths.postShow(topicSlug, post.id)} className="block group">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {post.title}
          </h3>

          {/* Post excerpt */}
          {post.content && (
            <p className="mt-2 text-gray-700 line-clamp-3">
              {post.content}
            </p>
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
            <p>
              By <span className="font-medium text-gray-700">{post.user.name}</span>
            </p>
            <p>{post._count.comments} comments</p>
          </div>
        </Link>
      </div>
    );


  });

  return <div className="space-y-2">{renderedPosts}</div>;
}
