import { eq } from "drizzle-orm";
import { db } from "@/db";
import { comments, users } from "@/db/schema";

export type CommentWithAuthor = typeof comments.$inferSelect & {
    user: {
        name: string | null;
        image: string | null;
    };
};

export async function fetchCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
    const rows = await db
        .select({
            ...comments,
            userName: users.name,
            userImage: users.image,
        })
        .from(comments)
        .leftJoin(users, eq(comments.userId, users.id))
        .where(eq(comments.postId, postId));

    return rows.map(row => ({
        ...row,
        user: {
            name: row.userName,
            image: row.userImage,
        },
    }));
}
