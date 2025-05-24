import { LikedView } from '@/modules/playlist/ui/views/LikedView';
import { HydrateClient, trpc } from '@/trpc/server';
export const dynamic = 'force-dynamic';

const page = async () => {
    void trpc.playlist.getLiked.prefetchInfinite({ limit: 5 });
    return (
        <HydrateClient>
            <LikedView />
        </HydrateClient>
    );
};
export default page;
