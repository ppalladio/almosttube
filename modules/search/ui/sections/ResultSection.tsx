'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoGridCard, { VideoGridCardSkeleton } from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard, { VideoRowCardSkeleton } from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface ResultSectionProps {
    query: string | undefined;
    categoryId?: string;
}
const ResultSectionSkeleton = () => {
    return (
        <div>
            <div className="hidden flex-col gap-4 md:flex">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} />
                ))}
            </div>
            <div className="md:hidden flex-col gap-4 flex p-4 gap-y-10 pt-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
export const ResultSection = ({ query, categoryId }: ResultSectionProps) => {
    return (
        <Suspense fallback={<ResultSectionSkeleton />} key={`${query}-${categoryId}`}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <ResultSectionSuspense query={query} categoryId={categoryId} />
            </ErrorBoundary>
        </Suspense>
    );
};
const ResultSectionSuspense = ({ query, categoryId }: ResultSectionProps) => {
    const isMobile = useIsMobile();
    const [results, resultsQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
        { query, categoryId, limit: 5 },
        { getNextPageParam: (lastPage) => lastPage.nextCursor },
    );

    return (
        <>
            {isMobile ? (
                <div className="flex flex-col gap-4 gap-y-10">
                    {results.pages.flatMap((page) => page.items.map((video) => <VideoGridCard key={video.id} data={video} />))}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {results.pages.flatMap((page) => page.items.map((video) => <VideoRowCard key={video.id} data={video} />))}
                </div>
            )}
            <InfiniteScroll
                hasNextPage={resultsQuery.hasNextPage}
                isFetchingNextPage={resultsQuery.isFetchingNextPage}
                fetchNextPage={resultsQuery.fetchNextPage}
            />
        </>
    );
};
export default ResultSection;
