'use client';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideoPlayer from '../components/VideoPlayer';
import VideoBanner from '../components/VideoBanner';
import VideoTopRow from '../components/VideoTopRow';
import { useAuth } from '@clerk/nextjs';

interface VideoSectionProps {
    videoId: string;
}
const VideoSection = ({ videoId }: VideoSectionProps) => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideoSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {
    const { isSignedIn } = useAuth();
    const utils = trpc.useUtils();
    const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId });
    const createView = trpc.videoViews.create.useMutation({
        onSuccess: () => utils.videos.getOne.invalidate({ id: videoId }),
    });
    const handlePlay = () => {
        if (!isSignedIn) return;
        createView.mutate({ videoId });
    };

    return (
        <>
            <div className={cn('aspect-video bg-black rounded-xl overflow-hidden relative', video.muxStatus !== 'ready' && 'rounded-b-none')}>
                <VideoPlayer
                    autoPlay
                    onPlay={handlePlay}
                    playbackId={video.muxPlaybackId!}
                    thumbnailUrl={video.muxThumbnailUrl ?? '/placeholder_img.png'}
                />
            </div>
            <VideoBanner status={video.muxStatus} />
            <VideoTopRow video={video} />
        </>
    );
};
export default VideoSection;
