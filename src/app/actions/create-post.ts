'use server'

import { auth } from "@/auth"
import { db } from "@/db"
import { topics , posts } from "@/db/schema"
import { eq } from "drizzle-orm"
import { redirect } from "next/navigation"
import paths from "@/paths"
import { revalidatePath } from "next/cache"
import { CreatePostSchema } from "@/schemas/CreatePostSchema"
import * as yup from "yup"

interface CreatePostFormState {
    errors : {
        title?: string[],
        content?: string[],
        _form?: string[]
    }
}

export default async function createPosts(slug:string, formState : CreatePostFormState , formData : FormData) : Promise<CreatePostFormState> {
    let post;
    try {
        const validatedData = await CreatePostSchema.validate(
            {
                title : formData.get('title'),
                content : formData.get('content')
            }, {abortEarly: false}
        )

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

        const newPosts = await db.insert(posts).values({
            title: validatedData.title,
            content: validatedData.content,
            userId : session.user.id!,
            topicId : topic[0].id,
        }).returning();
        
        post = newPosts[0];
        


    } catch (err) {
        if(err instanceof yup.ValidationError) {
            const errors : CreatePostFormState['errors'] = {};

            err.inner.forEach((error) => {
                if(error.path) {
                    const path = error.path as keyof typeof errors
                    if(!errors[path]){
                        errors[path] = []
                    }
                    errors[path]?.push(error.message)
                }
            })
            return {errors};
        }

        if(err instanceof Error) {
            return {
                errors :{
                    _form : [err.message]
                }
            }
        }

        return {
            errors : {
                _form : ["Something went wrong"]
            }
        }
    }

    console.log(post)
    revalidatePath(paths.topicShow(slug))
    redirect(paths.postShow(slug, post.id))
}