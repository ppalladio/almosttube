'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard, { VideoRowCardSkeleton } from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
interface VideosSectionProps {
    playlistId: string;
}
const VideosSection = ({ playlistId }: VideosSectionProps) => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideosSectionSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};
const VideosSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {' '}
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
            <div className="md:flex flex-col gap-4 hidden">
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
const VideosSectionSuspense = ({ playlistId }: VideosSectionProps) => {
    const [videos, query] = trpc.playlist.getVideos.useSuspenseInfiniteQuery(
        { limit: 5, playlistId },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );
    const utils = trpc.useUtils();
    const removeVideo = trpc.playlist.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success('Video Removed to playlist');
            utils.playlist.getMany.invalidate();
            utils.playlist.getManyForVideo.invalidate({ videoId: data.videoId });
            utils.playlist.getOne.invalidate({ id: data.playlistId });
            utils.playlist.getVideos.invalidate({ playlistId: data.playlistId });
        },
        onError: (error) => toast.error(error.message),
    });
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {videos.pages.flatMap((page) =>
                    page.items.map((video) => (
                        <VideoGridCard
                            key={video.id}
                            data={video}
                            onRemove={() => removeVideo.mutate({ videoId: video.id, playlistId: playlistId })}
                        />
                    )),
                )}
            </div>
            <div className="md:flex flex-col gap-4 hidden">
                {videos.pages.flatMap((page) =>
                    page.items.map((video) => (
                        <VideoRowCard
                            key={video.id}
                            data={video}
                            size="compact"
                            onRemove={() => removeVideo.mutate({ videoId: video.id, playlistId: playlistId })}
                        />
                    )),
                )}
            </div>
            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </div>
    );
};
export default VideosSection;
