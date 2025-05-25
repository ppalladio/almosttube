import { db } from '@/db';
import { users, videos } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';
import { z } from 'zod';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    bannerUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .middleware(async () => {
            const { userId: clerkUserId } = await auth();

            if (!clerkUserId) throw new UploadThingError('Unauthorized');

            const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId));

            if (!user) throw new UploadThingError('Unauthorized');

            if (user.bannerKey) {
                const utapi = new UTApi();

                await utapi.deleteFiles(user.bannerKey);
                await db
                    .update(users)
                    .set({ bannerKey: null, bannerUrl: null })
                    .where(and(eq(users.id, user.id)));
            }

            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .update(users)
                .set({
                    // file.url deprecated
                    bannerUrl: file.ufsUrl,
                    bannerKey: file.key,
                })
                .where(and(eq(users.id, metadata.userId)));
            return { uploadedBy: metadata.userId };
        }),
    thumbnailUploader: f({
        image: {
            /**
             * For full list of options and defaults, see the File Route API reference
             * @see https://docs.uploadthing.com/file-routes#route-config
             */
            maxFileSize: '4MB',
            maxFileCount: 1,
        },
    })
        .input(
            z.object({
                videoId: z.string().uuid(),
            }),
        )
        // Set permissions and file types for this FileRoute
        .middleware(async ({ input }) => {
            // This code runs on your server before upload
            const { userId: clerkUserId } = await auth();

            // If you throw, the user will not be able to upload
            if (!clerkUserId) throw new UploadThingError('Unauthorized');

            const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId));

            if (!user) throw new UploadThingError('Unauthorized');

            // ---->  video thumbnail clean up, only the latest thumbnail will be kept
            const [existingVideo] = await db
                .select({ muxThumbnailKey: videos.muxThumbnailKey })
                .from(videos)
                // ! eq(users.clerkId, clerkUserId)
                .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));

            if (!existingVideo) {
                throw new UploadThingError('NOT_FOUND');
            }

            if (existingVideo.muxThumbnailKey) {
                const utapi = new UTApi();

                await utapi.deleteFiles(existingVideo.muxThumbnailKey);
                await db
                    .update(videos)
                    .set({ muxThumbnailKey: null, muxThumbnailUrl: null })
                    .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));
            }
            // <------ video thumbnail clean up
            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { user, ...input };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            await db
                .update(videos)
                .set({
                    // file.url deprecated
                    muxThumbnailUrl: file.ufsUrl,
                    muxThumbnailKey: file.key,
                })
                .where(and(eq(videos.id, metadata.videoId), eq(videos.userId, metadata.user.id)));
            return { uploadedBy: metadata.user.id };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
