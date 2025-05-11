import { HydrateClient, trpc } from '@/trpc/server';
import {SubscriptionView} from '@/modules/home/ui/view/SubscriptionsView';
export const dynamic = 'force-dynamic';

export default async function Page() {
    void trpc.videos.getSubscriptions.prefetchInfinite({ limit: 5 });
    return (
        <HydrateClient>
            <SubscriptionView />
        </HydrateClient>
    );
}
