import { TrendingView } from '@/modules/home/ui/view/TrendingView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

export default async function Page() {
    void trpc.videos.getManyTrending.prefetchInfinite({ limit: 5 });
    return (
        <HydrateClient>
            <TrendingView />
        </HydrateClient>
    );
}
