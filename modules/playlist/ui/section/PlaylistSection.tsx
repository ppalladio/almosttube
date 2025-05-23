'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import { trpc } from '@/trpc/client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import PlaylistGridCard, { PlaylistGridCardSkeleton } from '../components/PlaylistGridCard';

const PlaylistSection = () => {
    return (
        <Suspense fallback={<PlaylistSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};
const PlaylistSectionSkeleton = () => {
    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
                {Array.from({ length: 10 }).map((_, index) => (
                    <PlaylistGridCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
};
const PlaylistSectionSuspense = () => {
    const [playlists, query] = trpc.playlist.getMany.useSuspenseInfiniteQuery(
        { limit: 5 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );
    console.log(playlists);

    return (
        <div>
            <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 [@media(min-width:1920px)]:grid-cols-5 [@media(min-width:2560px)]:grid-cols-6">
                {playlists.pages
                    .flatMap((page) => page.items)
                    .map((playlist) => (
                        <PlaylistGridCard key={playlist.id} data={playlist} />
                    ))}
            </div>
            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </div>
    );
};
export default PlaylistSection;
