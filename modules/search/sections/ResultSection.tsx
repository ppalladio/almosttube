'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoGridCard from '@/modules/videos/ui/components/VideoGridCard';
import VideoRowCard from '@/modules/videos/ui/components/VideoRowCard';
import { trpc } from '@/trpc/client';

interface ResultSectionProps {
    query: string | undefined;
    categoryId?: string;
}
const ResultSection = ({ query, categoryId }: ResultSectionProps) => {
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
