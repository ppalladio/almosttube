// import { db } from '@/db';
// import { users, videos } from '@/db/schema';
// import { and, eq } from 'drizzle-orm';
// import { createUploadthing, type FileRouter } from 'uploadthing/next';
// import { UploadThingError, UTApi } from 'uploadthing/server';
// import { z } from 'zod';
// import { auth } from '@clerk/nextjs/server';

// const f = createUploadthing();

// // FileRouter for your app, can contain multiple FileRoutes
// export const ourFileRouter = {
//     // Define as many FileRoutes as you like, each with a unique routeSlug
//     thumbnailUploader: f({
//         image: {
//             /**
//              * For full list of options and defaults, see the File Route API reference
//              * @see https://docs.uploadthing.com/file-routes#route-config
//              */
//             maxFileSize: '4MB',
//             maxFileCount: 1,
//         },
//     })
//         .input(
//             z.object({
//                 videoId: z.string(),
//             }),
//         )
//         // Set permissions and file types for this FileRoute
//         .middleware(async ({ input }) => {
//             console.log("🚀 ~ .middleware ~ input:", input)
//             // This code runs on your server before upload
//             const { userId: clerkUserId } = await auth();

//             // If you throw, the user will not be able to upload
//             if (!clerkUserId) throw new UploadThingError('Unauthorized');
//             const [user] = await db.select().from(users).where(eq(users.clerkId, clerkUserId));
//             if (!user) throw new UploadThingError('Unauthorized');

//             const [existingVideo] = await db
//                 .select({ muxThumbnailKey: videos.muxThumbnailKey })
//                 .from(videos)
//                 .where(and(eq(videos.id, input.videoId), eq(users.clerkId, clerkUserId)));

//             if (!existingVideo) {
//                 throw new UploadThingError('BAD_REQUEST');
//             }

//             if (!existingVideo.muxThumbnailKey) {
//                 const utapi = new UTApi();

//                 await utapi.deleteFiles(existingVideo.muxThumbnailKey as string);
//                 await db
//                     .update(videos)
//                     .set({ muxThumbnailKey: null, muxThumbnailUrl: null })
//                     .where(and(eq(videos.id, input.videoId), eq(videos.userId, user.id)));
//             }
//             // Whatever is returned here is accessible in onUploadComplete as `metadata`
//             return { user, ...input };
//         })
//         .onUploadComplete(async ({ metadata, file }) => {
//         console.log("🚀 ~ .onUploadComplete ~ file:", file)
//         console.log("🚀 ~ .onUploadComplete ~ metadata:", metadata)
// 			console.log('updaload conpleted')
//             await db
//                 .update(videos)
//                 .set({
//                     // file.url deprecated
//                     muxThumbnailUrl: file.ufsUrl,
//                     muxThumbnailKey: file.key,
//                 })
//                 .where(and(eq(videos.id, metadata.videoId), eq(videos.userId, metadata.user.id)));
//             // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
//             return { uploadedBy: metadata.user.id };
//         }),
// } satisfies FileRouter;

// export type OurFileRouter = typeof ourFileRouter;

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({
    image: {
      /**
       * For full list of options and defaults, see the File Route API reference
       * @see https://docs.uploadthing.com/file-routes#route-config
       */
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.ufsUrl);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
