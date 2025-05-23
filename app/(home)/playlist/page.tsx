import { PlaylistView } from '@/modules/playlist/view/PlaylistView';
import { HydrateClient, trpc } from '@/trpc/server';

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
