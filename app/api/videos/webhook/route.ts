import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks.mjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent = VideoAssetCreatedWebhookEvent | VideoAssetReadyWebhookEvent | VideoAssetErroredWebhookEvent | VideoAssetTrackReadyWebhookEvent;

export const POST = async (req: Request) => {
    console.log('Webhook received');

    if (!SIGNING_SECRET) {
        throw new Error('MUX_WEBHOOK_SECRET is missing');
    }

    const headersPayload = await headers();
    const muxSignature = headersPayload.get('mux-signature');
    console.log('Signature:', muxSignature);

    if (!muxSignature) {
        return new Response('no signature found', { status: 401 });
    }

    const payload = await req.json();
    console.log('Raw payload:', payload);

    const body = JSON.stringify(payload);
    mux.webhooks.verifySignature(
        body,
        {
            'mux-signature': muxSignature,
        },
        SIGNING_SECRET,
    );
    console.log('Full payload:', payload);
    console.log('Data object:', {
        id: payload.data.id,
        upload_id: payload.data.upload_id,
        status: payload.data.status,
        playback_ids: payload.data.playback_ids,
        full_data: payload.data,
    });
    switch (payload.type as WebhookEvent['type']) {
        case 'video.asset.created':
            const data = payload.data as VideoAssetCreatedWebhookEvent['data'];

            if (!data.upload_id) {
                return new Response('No upload ID found', { status: 400 });
            }
            await db
                .update(videos)
                .set({
                    muxAssetId: data.id,
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id));
            break;
    }
    return new Response('video updated'+data, { status: 200 });
};
