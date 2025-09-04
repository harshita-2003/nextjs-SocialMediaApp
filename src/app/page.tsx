// import TopicCreateForm from "@/components/topics/topic-create-form";
// import TopicList from "@/components/topics/topic-list";
// import { Divider } from "@nextui-org/react";
// import PostList from "@/components/posts/post-list";
// import { fetchTopPosts } from "@/db/queries/posts";

// export default async function Home() {
//   return (
//     <div className="grid grid-cols-4 gap-4 p-4">
//       <div className="col-span-3">
//         <h1 className="text-xl m-2 font-bold flex justify-center">Top Posts</h1>
//         <PostList fetchData={fetchTopPosts} />
//       </div>

//       <div className="border shadow py-3 px-5 flex flex-col my-2">
//         <TopicCreateForm />
//         <Divider className="my-2" />
//         <h3 className="text-lg mb-3 font-bold">Topics</h3>
//         <TopicList />
//       </div>
//     </div>
//   );
// }






import TopicCreateForm from "@/components/topics/topic-create-form";
import TopicList from "@/components/topics/topic-list";
import { Divider } from "@nextui-org/react";
import PostList from "@/components/posts/post-list";
import { fetchTopPosts } from "@/db/queries/posts";

export default async function Home() {
  return (
    <main className="max-w-8xl mx-auto p-6 pt-4">
      <h1 className="text-3xl font-extrabold mb-6 text-center text-gray-900">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Left/Main Section - Top Posts */}
        <section className="md:col-span-3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-gray-800">
            Top Posts
          </h2>
          <PostList fetchData={fetchTopPosts} />
        </section>

        {/* Right Sidebar - Topics & Create Topic */}
        <aside className="bg-white rounded-lg shadow-md p-6 flex flex-col">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              Create New Topic
            </h2>
            <TopicCreateForm />
          </div>

          <Divider className="my-4" />

          <div className="flex-grow">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Topics</h2>
            <TopicList />
          </div>
        </aside>
      </div>
    </main>
  );
}
