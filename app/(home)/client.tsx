'use client';
import { trpc } from '@/trpc/client';

export default function HomePageClient() {
    const [data] = trpc.hello.useSuspenseQuery({ text: 'prefetch' });

    return <div>client says {data.greeting}</div>;
}
