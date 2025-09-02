import Link from "next/link";
import { Chip } from "@nextui-org/react";
import { db } from "@/db";
import paths from "@/paths";
import { topics } from "@/db/schema";

export default async function TopicList() {
    const topicsList = await db.select().from(topics).all();

    const renderedTopics = topicsList.map((topic) => {
        return (
            <div key={topic.id}>
                <Link href ={paths.topicShow(topic.slug)}>
                    <Chip color="warning" variant="shadow"> 
                        {topic.slug}
                    </Chip>
                </Link>
            </div>
        )
    })

    return (
        <div className="flex flex-col gap-2">
            {renderedTopics}
        </div>

    )
}