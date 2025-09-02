'use server'

import { z } from 'zod';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { topics } from '@/db/schema'
import paths from '@/paths';
import { revalidatePath } from 'next/cache';

const createTopicSchema = z.object({
    name: z.string().min(3).regex(/^[a-z-]+$/ , {message : 'Must be lower case letters'}),
    description: z.string().min(5),
})

interface CreteTopicFormState {
    errors :{
        name?: string[],
        description?: string[],
        _form?: string[]
    }
}


export async function createTopic(formState: CreteTopicFormState, formData: FormData) : Promise<CreteTopicFormState> {
    const result = createTopicSchema.safeParse({
        name : formData.get('name'),
        description : formData.get('description')
    });

    if(!result.success) {
        //console.log(result.error.flatten().fieldErrors)
        return {
            errors: result.error.flatten().fieldErrors
        }
    }

    //check if user logged in
    const session = await auth();
    if(!session || !session.user) {
        return {
            errors : {
                _form : ["You must be signed in to do this."]
            }
        }
    }

    let topic;
    try {
        const newTopics = await db.insert(topics).values({
            slug: result.data.name,
            description: result.data.description
        }).returning();
        
        topic = newTopics[0];
        
    } catch (err: unknown) {
        if (err instanceof Error) {
            return {
                errors: {
                    _form: [err.message]
                }
            }
        }
        return {
            errors: {
                _form: ['Something went wrong']
            }
        }
    }

    revalidatePath(paths.topicShow(topic.slug))
    redirect(paths.topicShow(topic.slug))
    
}