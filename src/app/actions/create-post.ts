'use server'

import { auth } from "@/auth"
import { z } from "zod"
import { db } from "@/db"
import { topics , posts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import paths from "@/paths"
import { revalidatePath } from "next/cache"

const CreatePostSchema = z.object({
    title: z.string().min(3),
    content: z.string().min(10),
})

interface CreatePostFormState {
    errors : {
        title?: string[],
        content?: string[],
        _form?: string[]
    }
}

export default async function createPosts(slug:string, formState : CreatePostFormState , formData : FormData) : Promise<CreatePostFormState> {
    const result = CreatePostSchema.safeParse({
        title : formData.get('title'),
        content : formData.get('content')
    })

    if(!result.success) {
        return {
            errors : result.error.flatten().fieldErrors
        }
    }

    //check if user logged in
    const session = await auth();
    if(!session || !session.user) {
        return {
            errors : {
                _form : ["You have to be signed in to this"]
            }
        }
    }

    // get topics table value - like javascript
    const topic = await db.select().from(topics).where(eq(topics.slug , slug))
    if(!topic) {
        return {
            errors: {
                _form : ['Cannot find topic']
            }
        }
    }

    let post;
    try {
        const newPosts = await db.insert(posts).values({
            title: result.data.title,
            content: result.data.content,
            userId : session.user.id!,
            topicId : topic[0].id,
        }).returning();
        
        post = newPosts[0];

    } catch (error : unknown) {
        if(error instanceof Error) {
            return {
                errors : {
                    _form : [error.message]
                }
            }
        } else {
            return {
                errors : {
                    _form : ['Failed to create post']
                }
            }
        }
    }

    revalidatePath(paths.topicShow(slug))
    redirect(paths.postShow(slug, post.id))

}