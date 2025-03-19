import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import { createTRPCRouter, protectedProcedure } from '@/trpc/init';

export const VideoRouter = createTRPCRouter({
    create: protectedProcedure.mutation(async ({ ctx }) => {
        const { id: userId } = ctx.user;
        const upload = await mux.video.uploads.create({
            new_asset_settings: {
                passthrough: userId,
                playback_policy: ['public'],
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
