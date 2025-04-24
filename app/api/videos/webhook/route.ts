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
import { UTApi } from 'uploadthing/server';

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

    if (!muxSignature) {
        return new Response('no signature found', { status: 401 });
    }

    const payload = await req.json();

    const body = JSON.stringify(payload);
    try {
        mux.webhooks.verifySignature(
            body,
            {
                'mux-signature': muxSignature,
            },
            SIGNING_SECRET,
        );
    } catch (err) {
        console.error('❌ Signature verification failed', err);
        return new Response('invalid signature', { status: 401 });
    }

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
            //todo --- move this to background job
            const tempMuxThumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.png`;
            const tempMuxPreviewUrl = `https://image.mux.com/${playbackId}/animated.gif`;
            const duration = data.duration ? Math.round(data.duration * 1000) : 0;

            const utapi = new UTApi();
            let previewRes, thumbnailRes;
            // TODO ---- error handling temp ----
            try {
                // Upload gif first, then thumbnail — keep order in sync!
                [previewRes, thumbnailRes] = await utapi.uploadFilesFromUrl([tempMuxPreviewUrl, tempMuxThumbnailUrl]);
                console.log("🚀 ~ POST ~ thumbnailRes:", thumbnailRes)
                console.log("🚀 ~ POST ~ previewRes:", previewRes)

                if (!previewRes?.data || !thumbnailRes?.data) {
                    throw new Error('Missing UploadThing data');
                }
            } catch (err) {
                console.error('⚠️ UploadThing failed:', err);
                // Continue anyway
            }
            // -------
            await db
                .update(videos)
                .set({
                    muxStatus: data.status,
                    muxPlaybackId: playbackId,
                    muxAssetId: data.id,
                    duration,
                    muxPreviewUrl: previewRes?.data?.ufsUrl ?? null,
                    muxPreviewKey: previewRes?.data?.key ?? null,
                    muxThumbnailUrl: thumbnailRes?.data?.ufsUrl ?? null,
                    muxThumbnailKey: thumbnailRes?.data?.key ?? null,
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
            try {
                await db.update(videos).set({ muxTrackId: trackId, muxTrackStatus: status }).where(eq(videos.muxAssetId, assetId));
            } catch (err) {
                console.error('❌ DB error updating track', err);
                return new Response('db error', { status: 500 });
            }

            break;
        }
    }
    return new Response('video updated', { status: 200 });
};
