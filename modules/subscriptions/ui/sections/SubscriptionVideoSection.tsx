'use client';
import InfiniteScroll from '@/components/InfiniteScroll';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';
import SubscriptionItem, { SubscriptionItemSkeleton } from '../components/SubscriptionItem';

const SubscriptionVideosSection = () => {
    return (
        <Suspense fallback={<VideosSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <SubscriptionVideosSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};
const VideosSectionSkeleton = () => {
    return (
        <div className="flex flex-col gap-4 ">
            {Array.from({ length: 10 }).map((_, index) => (
                <SubscriptionItemSkeleton key={index} />
            ))}
        </div>
    );
};
const SubscriptionVideosSectionSuspense = () => {
    const [subscriptions, query] = trpc.subscription.getMany.useSuspenseInfiniteQuery(
        { limit: 5 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );
    const utils = trpc.useUtils();

    const unsubscribed = trpc.subscription.remove.useMutation({
        onSuccess: (data) => {
            toast.success('Successfully unsubscribed ');
            utils.subscription.getMany.invalidate();
            utils.videos.getSubscriptions.invalidate();
            utils.users.getOne.invalidate({ id: data.creatorId });
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });
    return (
        <div>
            <div className="flex flex-col gap-4  ">
                {subscriptions.pages.flatMap((page) =>
                    page.items.map((item) => (
                        <Link href={`/users/${item.user.id}`} key={item.creatorId} className="flex flex-col gap-4 ">
                            <SubscriptionItem
                                name={item.user.name}
                                imageUrl={item.user.imageUrl}
                                subscriberCount={item.user.subscriberCount}
                                onUnsubscribe={() => unsubscribed.mutate({ userId: item.creatorId })}
                                disabled={unsubscribed.isPending}
                            />
                        </Link>
                    )),
                )}
            </div>

            <InfiniteScroll hasNextPage={query.hasNextPage} isFetchingNextPage={query.isFetchingNextPage} fetchNextPage={query.fetchNextPage} />
        </div>
    );
};
export default SubscriptionVideosSection;
