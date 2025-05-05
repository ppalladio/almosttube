'use client';
import InfiniteScroll from '@/components/InfiniteScroll';

import CommentForm from '@/modules/comments/ui/components/CommentForm';
import CommentItem from '@/modules/comments/ui/components/CommentItem';
import { trpc } from '@/trpc/client';
import { Loader2Icon } from 'lucide-react';

import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
interface CommentsSectionProps {
    videoId: string;
}
const CommentsSectionSkeleton = () => {
    return (
        <div className="mt-6 flex justify-center items-center">
            <Loader2Icon className="text-muted-foreground size-7 animate-spin" />
        </div>
    );
};
export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
    return (
        <Suspense fallback={<CommentsSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <CommentsSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};
const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {
    const [comments, query] = trpc.comments.getMany.useSuspenseInfiniteQuery(
        { limit: 5, videoId },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    )

    return (
        <div className="mt-6 ">
            <div className="flex flex-col gap-6">
                <h1 className="text-xl font-bold">{comments.pages[0].totalCount} comments</h1>
                <CommentForm videoId={videoId} />
                <div className="flex flex-col gap-4 mt-2">
                    {comments.pages.flatMap((page) => page.items.map((comment) => <CommentItem key={comment.id} comment={comment} />))}
                    <InfiniteScroll
                        isManual
                        hasNextPage={query.hasNextPage}
                        isFetchingNextPage={query.isFetchingNextPage}
                        fetchNextPage={query.fetchNextPage}
                    />
                </div>
               
            </div>
        </div>
    );
};
export default CommentsSection;
