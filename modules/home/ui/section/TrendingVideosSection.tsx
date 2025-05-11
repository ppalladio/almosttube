'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const TrendingVideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <TrendingVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};
const VideosSectionSkeleton = () => {
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
const TrendingVideosSectionSuspense = () => {
    const [videos, query] = trpc.videos.getManyTrending.useSuspenseInfiniteQuery(
        { limit: 5 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );

    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
                {videos.pages.flatMap((page) => page.items.map((video) => <VideoGridCard key={video.id} data={video} />))}
            </div>
            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </div>
    );
};
export default TrendingVideosSection;
