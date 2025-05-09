'use client';

import { trpc } from '@/trpc/client';
import VideoRowCard, { VideoRowCardSkeleton } from '../components/VideoRowCard';
import VideoGridCard, { VideoGridCardSkeleton } from '../components/VideoGridCard';
import InfiniteScroll from '@/components/InfiniteScroll';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

interface SuggestionsSectionProps {
    videoId: string;
    isManual?: boolean;
}
export const SuggestionsSectionSkeleton = () => {
    return (
        <>
            <div className="hidden md:block space-y-3">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoRowCardSkeleton key={index} size="compact" />
                ))}
            </div>
            <div className="block md:hidden space-y-10">
                {Array.from({ length: 8 }).map((_, index) => (
                    <VideoGridCardSkeleton key={index} />
                ))}
            </div>
        </>
    );
};
export const SuggestionsSection = ({ videoId, isManual }: SuggestionsSectionProps) => {
    return (
        <Suspense fallback={<SuggestionsSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <SuggestionsSectionSuspense videoId={videoId} isManual={isManual} />
            </ErrorBoundary>
        </Suspense>
    );
};
const SuggestionsSectionSuspense = ({ videoId, isManual }: SuggestionsSectionProps) => {
    const [suggestions, query] = trpc.suggestions.getMany.useSuspenseInfiniteQuery(
        { limit: 5, videoId },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );
    return (
        <>
            <div className="hidden md:block space-y-3">
                {suggestions.pages.flatMap((page) => page.items.map((video) => <VideoRowCard key={video.id} data={video} size="compact" />))}
            </div>
            <div className="block md:hidden space-y-10">
                {suggestions.pages.flatMap((page) => page.items.map((video) => <VideoGridCard key={video.id} data={video} />))}
            </div>
            <InfiniteScroll
                isManual={isManual}
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
            />
        </>
    );
};
export default SuggestionsSection;
