import { db } from '@/db';
import { commentReactions, comments, users } from '@/db/schema';
import { baseProcedure, createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { eq, getTableColumns, desc, or, lt, and, count, inArray, isNull, isNotNull } from 'drizzle-orm';
import { z } from 'zod';

export const CommentRouter = createTRPCRouter({
    create: protectedProcedure
        .input(
            z.object({
                videoId: z.string().uuid(),
                value: z.string(),
                parentId: z.string().uuid().nullish(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { parentId, videoId, value } = input;
            const { id: userId } = ctx.user;
            const [existingComment] = await db
                .select()
                .from(comments)
                .where(inArray(comments.id, parentId ? [parentId] : []));
            if (!existingComment && parentId) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }

            if (existingComment?.parentId && parentId) {
                throw new TRPCError({ code: 'BAD_REQUEST' });
            }
            const [createdComment] = await db
                .insert(comments)
                .values({
                    userId,
                    videoId,
                    parentId,
                    value,
                })
                .returning();

            return createdComment;
        }),
    remove: protectedProcedure
        .input(
            z.object({
                id: z.string().uuid(),
            }),
        )
        .mutation(async ({ ctx, input }) => {
            const { id } = input;
            const { id: userId } = ctx.user;

            const [deletedComment] = await db
                .delete(comments)
                .where(and(eq(comments.userId, userId), eq(comments.id, id)))
                .returning();
            if (!deletedComment) {
                throw new TRPCError({ code: 'NOT_FOUND' });
            }
            return deletedComment;
        }),

    getMany: baseProcedure
        .input(
            z.object({
                videoId: z.string().uuid(),
                cursor: z
                    .object({
                        id: z.string().uuid(),
                        updatedAt: z.date(),
                    })
                    .nullish(),
                limit: z.number().min(1).max(100),
                parentId: z.string().uuid().nullish(),
            }),
        )
        .query(async ({ input, ctx }) => {
            const { videoId, cursor, limit, parentId } = input;
            const { ClerkUserId } = ctx;
            let userId;
            const [user] = await db
                .select()
                .from(users)
                .where(inArray(users.clerkId, ClerkUserId ? [ClerkUserId] : []));
            if (user) userId = user.id;
            const viewerReactions = db.$with('viewer_reactions').as(
                db
                    .select({ commentId: commentReactions.commentId, type: commentReactions.type })
                    .from(commentReactions)
                    .where(inArray(commentReactions.userId, userId ? [userId] : [])),
            );

            const replies = db.$with('replies').as(
                db
                    .select({ parentId: comments.parentId, count: count(comments.id).as('count') })
                    .from(comments)
                    .where(isNotNull(comments.parentId))
                    .groupBy(comments.parentId),
            );
            const [totalData, data] = await Promise.all([
                // total data
                db.select({ count: count() }).from(comments).where(eq(comments.videoId, videoId)),
                // data
                db
                    .with(viewerReactions, replies)
                    .select({
                        ...getTableColumns(comments),
                        user: users,
                        viewerReaction: viewerReactions.type,
                        likeCount: db.$count(commentReactions, and(eq(commentReactions.commentId, comments.id), eq(commentReactions.type, 'like'))),
                        dislikeCount: db.$count(
                            commentReactions,
                            and(eq(commentReactions.commentId, comments.id), eq(commentReactions.type, 'dislike')),
                        ),
                        replyCount: replies.count,
                    })
                    .from(comments)
                    .where(
                        and(
                            eq(comments.videoId, videoId),
                            parentId ? eq(comments.parentId, parentId) : isNull(comments.parentId),
                            cursor
                                ? or(
                                      lt(comments.updatedAt, cursor.updatedAt),
                                      and(eq(comments.updatedAt, cursor.updatedAt), lt(comments.id, cursor.id)),
                                  )
                                : undefined,
                        ),
                    )
                    .innerJoin(users, eq(comments.userId, users.id))
                    .leftJoin(viewerReactions, eq(viewerReactions.commentId, comments.id))
                    .leftJoin(replies, eq(replies.parentId, comments.id))
                    .orderBy(desc(comments.updatedAt), desc(comments.id))
                    .limit(limit + 1),
            ]);

            const hasMore: boolean = data.length > limit;
            const items = hasMore ? data.slice(0, -1) : data;
            const lastItem = items[items.length - 1];
            const nextCursor = hasMore ? { id: lastItem.id, updatedAt: lastItem.updatedAt } : null;

            return { totalCount: totalData[0].count, items, nextCursor };
        }),
});
