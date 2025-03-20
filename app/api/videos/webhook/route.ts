import { db } from '@/db';
import { videos } from '@/db/schema';
import { mux } from '@/lib/mux';
import {
    VideoAssetCreatedWebhookEvent,
    VideoAssetDeletedWebhookEvent,
    VideoAssetErroredWebhookEvent,
    VideoAssetReadyWebhookEvent,
    VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks.mjs';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

const SIGNING_SECRET = process.env.MUX_WEBHOOK_SECRET!;

type WebhookEvent =
    | VideoAssetCreatedWebhookEvent
    | VideoAssetReadyWebhookEvent
    | VideoAssetErroredWebhookEvent
    | VideoAssetTrackReadyWebhookEvent
    | VideoAssetDeletedWebhookEvent;

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

    switch (payload.type as WebhookEvent['type']) {
        case 'video.asset.created':
            {
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
            }
            break;

        case 'video.asset.ready': {
            const data = payload.data as VideoAssetReadyWebhookEvent['data'];
            const playbackId = data.playback_ids?.[0].id;
            if (!data.upload_id) {
                return new Response('No upload ID found', { status: 400 });
            }
            if (!playbackId) {
                return new Response('No playback ID found', { status: 400 });
            }

            const muxThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.png`;
            const muxPreviewUrl = `https://player.mux.com/${playbackId}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                    muxPlaybackId: playbackId,
                    muxAssetId: data.id,
                    muxThumbnailUrl,
                    muxPreviewUrl,
                    duration,
                })
                .where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case 'video.asset.errored': {
            const data = payload.data as VideoAssetErroredWebhookEvent['data'];

            if (!data.upload_id) {
                return new Response('No upload ID found', { status: 400 });
            }
            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                })
                .where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case 'video.asset.deleted': {
            const data = payload.data as VideoAssetDeletedWebhookEvent['data'];

            if (!data.upload_id) {
                return new Response('No upload ID found', { status: 400 });
            }

            await db.delete(videos).where(eq(videos.muxUploadId, data.upload_id));
            break;
        }

        case 'video.asset.track.ready': {
            const data = payload.data as VideoAssetTrackReadyWebhookEvent['data'] & { asset_id: string };
            const assetId = data.asset_id;
            const trackId = data.id;
            const status = data.status;

            if (!assetId) {
                return new Response('No asset ID found', { status: 400 });
            }

            await db.update(videos).set({ muxTrackId: trackId, muxTrackStatus: status }).where(eq(videos.muxAssetId, assetId));

            break;
        }
    }
    return new Response('video updated', { status: 200 });
};
