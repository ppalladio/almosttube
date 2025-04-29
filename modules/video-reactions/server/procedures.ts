import { db } from '@/db';
import { videoReactions, videoViews } from '@/db/schema';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';

export const VideoReactionRouter = createTRPCRouter({
    like: protectedProcedure.input(z.object({ videoId: z.string().uuid() })).mutation(async ({ input, ctx }) => {
        const { id: userId } = ctx.user;
        const { videoId } = input;

        const [existingVideoReaction] = await db
            .select()
            .from(videoReactions)
            .where(and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId), eq(videoReactions.type, 'like')));
        if (existingVideoReaction) {
            const [deletedVideoReaction] = await db
                .delete(videoReactions)
                .where(and(eq(videoReactions.userId, userId), eq(videoReactions.videoId, videoId)))
                .returning();
            return deletedVideoReaction;
        }

        const [createdVideoReaction] = await db
            .insert(videoReactions)
            .values({
                userId,
                videoId,
                type: 'like',
            })
            .onConflictDoUpdate({
                target: [videoReactions.userId, videoReactions.videoId],
                set: { type: 'like' },
            })
            .returning();

        return createdVideoReaction;
    }),
    dislike: protectedProcedure.input(z.object({ videoId: z.string().uuid() })).mutation(async ({ input, ctx }) => {
        const { id: userId } = ctx.user;
        const { videoId } = input;

        const [existingVideoReaction] = await db
            .select()
            .from(videoReactions)
            .where(and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId), eq(videoReactions.type, 'dislike')));
        if (existingVideoReaction) {
            const [deletedVideoReaction] = await db
                .delete(videoReactions)
                .where(and(eq(videoReactions.userId, userId), eq(videoReactions.videoId, videoId)))
                .returning();
            return deletedVideoReaction;
        }

        const [createdVideoReaction] = await db
            .insert(videoReactions)
            .values({
                userId,
                videoId,
                type: 'dislike',
            })
			// in case of the video is already liked change to dislike
            .onConflictDoUpdate({
                target: [videoReactions.userId, videoReactions.videoId],
                set: { type: 'dislike' },
            })
            .returning();

        return createdVideoReaction;
    }),
});
