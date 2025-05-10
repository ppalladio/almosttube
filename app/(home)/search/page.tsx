import ResultSection from '@/modules/search/sections/ResultSection';
import SearchView from '@/modules/search/ui/views/SearchView';
import { HydrateClient, trpc } from '@/trpc/server';

interface PageProps {
    searchParams: Promise<{ query: string | undefined; categoryId?: string }>;
}
const page = async ({ searchParams }: PageProps) => {
    const { query, categoryId } = await searchParams;
    void trpc.categories.getMany.prefetch();
    void trpc.search.getMany.prefetchInfinite({ query, limit: 5 });
    return (
        <HydrateClient>
            <SearchView query={query} categoryId={categoryId} />
            <ResultSection query={query} categoryId={categoryId} />
        </HydrateClient>
    );
};
export default page;
