'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard, { VideoRowCardSkeleton } from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const LikedVideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <LikedSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};
const VideosSectionSkeleton = () => {
    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
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
const LikedSectionSuspense = () => {
    const [videos, query] = trpc.playlist.getLiked.useSuspenseInfiniteQuery(
        { limit: 5 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );

    return (
        <div>
            <div className="flex flex-col gap-4 gap-y-10 md:hidden">
                {videos.pages.flatMap((page) => page.items.map((video) => <VideoGridCard key={video.id} data={video} />))}
            </div>
            <div className="md:flex flex-col gap-4 hidden">
                {videos.pages.flatMap((page) => page.items.map((video) => <VideoRowCard key={video.id} data={video} size="compact" />))}
            </div>
            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </div>
    );
};
export default LikedVideosSection;
