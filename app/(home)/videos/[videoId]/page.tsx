import VideoView from '@/modules/videos/ui/views/VideoView';
import { HydrateClient, trpc } from '@/trpc/server';

interface PageProps {
    params: Promise<{ videoId: string }>;
}
const page = async ({ params }: PageProps) => {
    const { videoId } = await params;

    void trpc.videos.getOne.prefetch({ id: videoId });
    return (
        <HydrateClient>
            <VideoView videoId={videoId} />
        </HydrateClient>
    );
};
export default page;
