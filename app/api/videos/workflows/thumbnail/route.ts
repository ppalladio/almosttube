import { db } from '@/db';
import { videos } from '@/db/schema';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';

interface InputType {
    userId: string;
    videoId: string;
    prompt: string;
}

export const { POST } = serve(async (context) => {
    const input = context.requestPayload as InputType;
    console.log('🚀 ~ const{POST}=serve ~ input:', input);

    const { userId, videoId, prompt } = input;
    const utapi = new UTApi();

    const video = await context.run('get-video', async () => {
        const [existingVideo] = await db
            .select()
            .from(videos)
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
        if (!existingVideo) {
            return new Error('Video not found');
        }
        return existingVideo;
    });
    if (video instanceof Error) {
        throw video;
    }

    const { body } = await context.call<{ data: Array<{ url: string }> }>('generate-thumbnail', {
        url: 'https://api.openai.com/v1/images/generations',
        method: 'POST',
        body: {
            prompt,
            n: 1,
            model: 'dall-e-3',
            size: '1792x1024',
        },
        headers: {
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
    });
    const tempThumbnailUrl = body.data[0].url;

    if (!tempThumbnailUrl) {
        throw new Error('Could not generate thumbnail');
    }

    await context.run('thumbnail-cleanup', async () => {
        if (video.muxThumbnailKey) {
            await utapi.deleteFiles(video.muxThumbnailKey);
            await db
                .update(videos)
                .set({ muxThumbnailKey: null, muxThumbnailUrl: null })
                .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
        }
    });

    const uploadedThumbnail = await context.run('upload-thumbnail', async () => {
        const { data } = await utapi.uploadFilesFromUrl(tempThumbnailUrl);
        if (!data) {
            throw new Error('Could not upload thumbnail');
        }
        return data;
    });

    await context.run('update-video', async () => {
        await db
            .update(videos)

            .set({ muxThumbnailKey: uploadedThumbnail.key, muxThumbnailUrl: uploadedThumbnail.ufsUrl })
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
