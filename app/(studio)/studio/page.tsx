import StudioView from '@/modules/studio/ui/views/StudioView';
import { HydrateClient, trpc } from '@/trpc/server';

const page = () => {
    void trpc.studio.getMany.prefetchInfinite({ limit: 5 });

    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    );
};
export default page;
