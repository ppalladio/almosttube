'use client';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/trpc/client';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'sonner';

interface PlaylistHeaderProps {
    playlistId: string;
}
const PlaylistHeaderSkeleton = () => {
    return (
        <div className="flex flex-col gap-y-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
        </div>
    );
};
const PlaylistHeader = ({ playlistId }: PlaylistHeaderProps) => {
    return (
        <Suspense fallback={<PlaylistHeaderSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <PlaylistHeaderSuspense playlistId={playlistId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const PlaylistHeaderSuspense = ({ playlistId }: PlaylistHeaderProps) => {
    const utils = trpc.useUtils();
    const router = useRouter();
    const [playlist] = trpc.playlist.getOne.useSuspenseQuery({ id: playlistId });
    const remove = trpc.playlist.remove.useMutation({
        onSuccess: () => {
            toast.success('Playlist removed successfully');

            utils.playlist.getMany.invalidate();
            router.push('/playlist');
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
    return (
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-xs  text-muted-foreground">Videos from {playlist.name}</p>
            </div>
            <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={() => remove.mutate({ id: playlistId })}
                disabled={remove.isPending}
            >
                <Trash2Icon />
            </Button>
        </div>
    );
};
export default PlaylistHeader;
