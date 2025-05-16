import { HistoryView } from '@/modules/playlist/ui/views/HistoryView';
import { HydrateClient, trpc } from '@/trpc/server';
const page = async () => {
    void trpc.playlist.getHistory.prefetchInfinite({ limit: 5 });
    return (
        <HydrateClient>
            <HistoryView />
        </HydrateClient>
    );
};
export default page;
