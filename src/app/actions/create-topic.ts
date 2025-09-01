'use server'

import { z } from 'zod';

const createTopicSchema = z.object({
    name: z.string().min(3).regex(/^[a-z-]+$/ , {message : 'Must be lower case letters'}),
    description: z.string().min(5),
})


export async function createTopic( formData: FormData) {
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

    return {success: true, errors: {}}
}