"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";
import { comments } from "@/db/schema";
import * as yup from "yup"
import { createCommentSchema } from "@/schemas/createCommentSchema";

// Type for form state
interface CreateCommentFormState {
  errors: {
    content?: string[];
    _form?: string[];
  };
  success?: boolean;
}

// Main function
export async function createComment(
  { postId, parentId }: { postId: string; parentId?: string },
  formState: CreateCommentFormState,
  formData: FormData
): Promise<CreateCommentFormState> {

  try {
    // Validate comment content
    const validateData = await createCommentSchema.validate({
      content: formData.get("content"),
    });

    // Check authentication
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
      return {
        errors: {
          _form: ["You must sign in to do this."],
        },
      };
    }

    // Insert the comment into the database
    await db.insert(comments).values({
      content: validateData.content,
      postId,
      parentId,
      userId: session.user.id,
    });

  } catch (err) {
    //catches any yup validation error
    if(err instanceof yup.ValidationError) {
      const errors : CreateCommentFormState['errors'] = {};

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

    //any general issue like db operation fail
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } 

    return {
      errors: {
        _form: ["Something went wrong..."],
      },
    };
    
  }

  // Step 1: Find the post to get its topicId
  const post = await db.query.posts.findFirst({
    where: (posts, { eq }) => eq(posts.id, postId),
    columns: { topicId: true },
  });

  if (!post) {
    return {
      errors: {
        _form: ["Post not found."],
      },
    };
  }

  // Step 2: Use topicId to get the topic slug
  const topic = await db.query.topics.findFirst({
    where: (topics, { eq }) => eq(topics.id, post.topicId),
    columns: { slug: true },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Failed to revalidate topic."],
      },
    };
  }

  // Revalidate the path for the updated post
  revalidatePath(paths.postShow(topic.slug, postId));

  return {
    errors: {},
    success: true,
  };
}
