"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";
import { comments, posts, topics } from "@/db/schema";
import { eq } from "drizzle-orm";

// Zod schema for comment content validation
const createCommentSchema = z.object({
  content: z.string().min(3),
});

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
  // Validate comment content
  const result = createCommentSchema.safeParse({
    content: formData.get("content"),
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

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
  try {
    await db.insert(comments).values({
      content: result.data.content,
      postId,
      parentId,
      userId: session.user.id,
    });
  } catch (err) {
    if (err instanceof Error) {
      return {
        errors: {
          _form: [err.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
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
