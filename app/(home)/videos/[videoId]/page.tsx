import VideoView from '@/modules/videos/ui/views/VideoView';
import { HydrateClient, trpc } from '@/trpc/server';
export const dynamic = 'force-dynamic';
interface PageProps {
    params: Promise<{ videoId: string }>;
}
const page = async ({ params }: PageProps) => {
    const { videoId } = await params;

    void trpc.videos.getOne.prefetch({ id: videoId });
    void trpc.comments.getMany.prefetchInfinite({ videoId: videoId, limit: 5 });
    void trpc.suggestions.getMany.prefetchInfinite({ videoId: videoId, limit: 5 });
    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
};
export default page;
