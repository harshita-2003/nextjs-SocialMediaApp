'use server'

import * as yup from 'yup';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { db } from '@/db';
import { topics } from '@/db/schema'
import paths from '@/paths';
import { revalidatePath } from 'next/cache';
import { createTopicSchema } from '@/schemas/createTopicSchema';

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(formState: CreateTopicFormState, formData: FormData): Promise<CreateTopicFormState> {
  let topic;

  try {
    const validatedData = await createTopicSchema.validate(
      {
        name: formData.get('name'),
        description: formData.get('description'),
      },
      { abortEarly: false } // gather all errors
    );

    // Check if user logged in
    const session = await auth();
    if (!session || !session.user) {
      return {
        errors: {
          _form: ['You must be signed in to do this.'],
        },
      };
    }

    const newTopics = await db
      .insert(topics)
      .values({
        slug: validatedData.name,
        description: validatedData.description,
      })
      .returning();

    topic = newTopics[0];
    
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      // object with arrays per field
      const errors: CreateTopicFormState['errors'] = {};

      err.inner.forEach((error) => {
        if (error.path) {
          const path = error.path as keyof typeof errors;
          if (!errors[path]) {
            errors[path] = [];
          }
          errors[path]?.push(error.message);
        }
      });

      return { errors };
    }

    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    }

    return {
      errors: {
        _form: ['Something went wrong'],
      },
    };
  }

  revalidatePath(paths.topicShow(topic.slug));
  redirect(paths.topicShow(topic.slug));

}
