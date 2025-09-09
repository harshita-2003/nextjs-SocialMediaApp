//searchParam used in both client and server in different ways


import PostList from "@/components/posts/post-list";
import { fetchPostsBySearchTerm } from "@/db/queries/posts";
import { redirect } from "next/navigation";

interface SearchPageProps {
    searchParams : {
        term?: string;
    }
}

export default async function SearchPage({searchParams} : SearchPageProps) {

    const term = searchParams.term;

    if(!term) {
        redirect('/')
    }

    return (
        <div>
            <PostList fetchData={() => fetchPostsBySearchTerm(term)} />
        </div>
    )
}