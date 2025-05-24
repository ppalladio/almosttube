import UserView from '@/modules/users/ui/views/UserView';
import { HydrateClient, trpc } from '@/trpc/server';

interface PageProps {
    params: Promise<{ userId: string }>;
}
const page = async ({ params }: PageProps) => {
    const { userId } = await params;
    void trpc.users.getOne.prefetch({ id: userId });
    void trpc.videos.getMany.prefetchInfinite({ userId: userId, limit: 5 });
    return (
        <HydrateClient>
            <UserView userId={userId} />
        </HydrateClient>
    );
};
export default page;
