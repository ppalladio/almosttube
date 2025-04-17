import { db } from '@/db';
import { videos, videoUpdateSchema } from '@/db/schema';
import { mux } from '@/lib/mux';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { z } from 'zod';
import { UTApi } from 'uploadthing/server';

export const VideoRouter = createTRPCRouter({
    restoreThumbnail: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
        const utapi = new UTApi();

        const { id: userId } = ctx.user;
        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));

        if (!existingVideo) {
            return new TRPCError({ code: 'NOT_FOUND' });
        }

        // ---->  video thumbnail clean up
        if (existingVideo.muxThumbnailKey) {
            await utapi.deleteFiles(existingVideo.muxThumbnailKey);
            await db
                .update(videos)
                .set({ muxThumbnailKey: null, muxThumbnailUrl: null })
                .where(and(eq(videos.id, input.id), eq(videos.userId, userId)));
        }
        // <---- video thumbnail clean up
        if (!existingVideo.muxPlaybackId) {
            throw new TRPCError({ code: 'BAD_REQUEST' });
        }
        // now all the thumbnails are stored in uploadthing instead of the original mux generated thumbnails
        const tempMuxThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.png`;

        const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempMuxThumbnailUrl);

        if (!uploadedThumbnail.data) {
            throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
        }

        const { key: muxThumbnailKey, ufsUrl: muxThumbnailUrl } = uploadedThumbnail.data;

        const [updatedVideo] = await db
            .update(videos)
            .set({ muxThumbnailUrl, muxThumbnailKey })
            .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
            .returning();
        return updatedVideo;
    }),

    remove: protectedProcedure.input(z.object({ id: z.string().uuid() })).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;
        const [removedVideo] = await db
            .delete(videos)
            .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
            .returning();
        if (!removedVideo) {
            return new TRPCError({ code: 'NOT_FOUND' });
        }
        return removedVideo;
    }),

    update: protectedProcedure.input(videoUpdateSchema).mutation(async ({ ctx, input }) => {
        const { id: userId } = ctx.user;

        if (!input.id) {
            throw new TRPCError({ code: 'BAD_REQUEST' });
        }

        const [updatedVideo] = await db
            .update(videos)
            .set({
                title: input.title,
                description: input.description,
                categoryId: input.categoryId,
                visibility: input.visibility,
                updatedAt: new Date(),
            })
            .where(and(eq(videos.id, input.id), eq(videos.userId, userId)))
            .returning();

        if (!updatedVideo) {
            throw new TRPCError({ code: 'NOT_FOUND' });
        }
        return updatedVideo;
    }),
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ['public'],
                input: [
                    {
                        generated_subtitles: [
                            {
                                language_code: 'en',
                                name: 'English',
                            },
                        ],
                    },
                ],
                // ! will not work without credit card info
                // mp4_support: 'standard',
            },
            cors_origin: '*',
        });

        const [video] = await db
            .insert(videos)
            .values({
                userId,
                title: 'Untitled',
                muxStatus: 'waiting',
                muxUploadId: upload.id,
            })
            .returning();
        return { video, url: upload.url };
    }),
});
