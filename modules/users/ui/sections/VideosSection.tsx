'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface VideosSectionProps {
    userId: string;
}
const VideosSection = ({ userId }: VideosSectionProps) => {
    return (
        <Suspense key={userId} fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideosSectionSuspense userId={userId} />
            </ErrorBoundary>
        </Suspense>
    );
};
const VideosSectionSkeleton = () => {
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 ">
                {Array.from({ length: 10 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
const VideosSectionSuspense = ({ userId }: VideosSectionProps) => {
    const [videos, query] = trpc.videos.getMany.useSuspenseInfiniteQuery(
        { limit: 5, userId },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );

    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4  ">
                {videos.pages.flatMap((page) => page.items.map((video) => <VideoGridCard key={video.id} data={video} />))}
            </div>
            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </div>
    );
};
export default VideosSection;
