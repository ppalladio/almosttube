'use client';

import { trpc } from '@/trpc/client';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { FilterCarousel } from '@/components/FilterCarousel';
import { useRouter } from 'next/navigation';

interface CategoriesSectionProps {
    categoryId?: string;
}
// not necessary but a practice to prevent
export const CategoriesSection = ({ categoryId }: CategoriesSectionProps) => {
    return (
        <Suspense fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <CategoriesSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};

const CategoriesSectionSuspense = ({ categoryId }: CategoriesSectionProps) => {
    const router = useRouter();
    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    const data = categories.map(({ name, id }) => ({
        value: id,
        label: name,
    }));

    const onSelect = (value: string | null) => {
        const url = new URL(window.location.href);
        if (value) {
            url.searchParams.set('categoryId', value);
        } else {
            url.searchParams.delete('categoryId');
        }
        router.push(url.toString());
    };
    // TODO REMOVE CLG
    return <FilterCarousel value={categoryId} data={data} onSelect={onSelect} />;
};
