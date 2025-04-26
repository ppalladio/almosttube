import { db } from '@/db';
import { videos } from '@/db/schema';
import { DESCRIPTION_SYSTEM_PROMPT } from '@/lib/constants';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';

interface InputType {
    userId: string;
    videoId: string;
}

export const { POST } = serve(async (context) => {
    const input = context.requestPayload as InputType;
    const { userId, videoId } = input;

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

    const transcript = await context.run('get-transcript', async () => {
        const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;

        const res = await fetch(trackUrl);
        //!
        const text = await res.text();
        if (!text) {
            throw new Error('Could not get description');
        }
        return text;
    });

    const { body } = await context.api.openai.call('generate-description', {
        token: process.env.OPENAI_API_KEY!,
        operation: 'chat.completions.create',
        body: {
            model: 'gpt-4o',
            messages: [
                {
                    role: 'system',
                    content: DESCRIPTION_SYSTEM_PROMPT,
                },
                {
                    role: 'user',
                    content: transcript || 'this is the description of a youtube clone called almost tube and this is the transcript of the video: ',
                },
            ],
        },
    });
    const description = body.choices[0].message.content;
    if (!description) {
        throw new Error('Could not generate description');
    }
    await context.run('update-video', async () => {
        await db
            .update(videos)

            .set({ description: description || video.description })
            .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));
    });
});
