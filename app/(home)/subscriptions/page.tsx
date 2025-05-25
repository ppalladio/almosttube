import { SubscriptionView } from '@/modules/subscriptions/ui/views/SubscriptionView';
import { HydrateClient, trpc } from '@/trpc/server';
 
const page = ( ) => {
    void trpc.subscription.getMany.prefetchInfinite({ limit: 5 });

    return (
        <HydrateClient>
           <SubscriptionView/>
        </HydrateClient>
    );
};
export default page;
