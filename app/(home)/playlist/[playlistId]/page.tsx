 import { VideosView } from '@/modules/playlist/ui/views/VideosView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';
interface PageProps {
    params: Promise<{ playlistId: string }>;
}
const page = async ({ params }: PageProps) => {
    const { playlistId } = await params;
    void trpc.playlist.getVideos.prefetchInfinite({ playlistId, limit: 5 });
    void trpc.playlist.getOne.prefetchInfinite({ id: playlistId });

	
	return (
        <HydrateClient>
            <VideosView playlistId={playlistId} />
        </HydrateClient>
    );
};
export default page;
