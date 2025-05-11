import { HomeView } from '@/modules/home/ui/view/HomeView';
import { HydrateClient, trpc } from '@/trpc/server';

export const dynamic = 'force-dynamic';

interface PageProps {
    searchParams: Promise<{ categoryId?: string }>;
}
export default async function Page({ searchParams }: PageProps) {
    const { categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();
    void trpc.videos.getMany.prefetchInfinite({ categoryId: categoryId, limit: 5 });
    return (
        <HydrateClient>
            <HomeView categoryId={categoryId} />
        </HydrateClient>
    );
}
