import { PlaylistView } from '@/modules/playlist/ui/views/PlaylistView';
import { HydrateClient, trpc } from '@/trpc/server';
export const dynamic = 'force-dynamic';

const page = () => {
    void trpc.playlist.getMany.prefetchInfinite({
        limit: 10,
    });
    return (
        <HydrateClient>
            <PlaylistView />
        </HydrateClient>
    );
};
export default page;
