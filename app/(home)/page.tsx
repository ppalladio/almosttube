import { HydrateClient, trpc } from '@/trpc/server';
import HomePageClient from './client';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

export default function Home() {
    void trpc.hello.prefetch({ text: 'prefetch' });

    return (
        <HydrateClient>
            <Suspense fallback={<div>loading</div>}>
                <ErrorBoundary fallback={<div>error</div>}>
                    <HomePageClient />
                </ErrorBoundary>
            </Suspense>
        </HydrateClient>
    );
}
