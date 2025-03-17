import StudioView from '@/modules/studio/view/StudioView';
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
