import InfiniteScroll from '@/components/InfiniteScroll';
import ResponsiveModal from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react';
import { toast } from 'sonner';
interface PlaylistAddModalProps {
    open: boolean;
    videoId: string;
    setOpen: (open: boolean) => void;
}

const PlaylistAddModal = ({ open, videoId, setOpen }: PlaylistAddModalProps) => {
    const {
        data: playlists,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = trpc.playlist.getManyForVideo.useInfiniteQuery(
        { videoId, limit: 10 },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
            enabled: !!videoId && open,
        },
    );
    const addVideo = trpc.playlist.addVideo.useMutation({
        onSuccess: (data) => {
            toast.success('Added to playlist');
            utils.playlist.getMany.invalidate();
            utils.playlist.getManyForVideo.invalidate();
            utils.playlist.getOne.invalidate({ id: data.playlistId });
            utils.playlist.getVideos.invalidate({ playlistId: data.playlistId });
        },
        onError: (error) => toast.error(error.message),
    });

    const removeVideo = trpc.playlist.removeVideo.useMutation({
        onSuccess: (data) => {
            toast.success('Video Removed to playlist');
            utils.playlist.getMany.invalidate();
            utils.playlist.getManyForVideo.invalidate();
            utils.playlist.getOne.invalidate({ id: data.playlistId });
            utils.playlist.getVideos.invalidate({ playlistId: data.playlistId });
        },
        onError: (error) => toast.error(error.message),
    });
    const utils = trpc.useUtils();
    const handleOnOpenChange = (newOpen: boolean) => {
        utils.playlist.getManyForVideo.reset();
        setOpen(newOpen);
    };
    return (
        <ResponsiveModal title="Add to playlist" open={open} onOpenChange={handleOnOpenChange}>
            <div className="flex flex-col gap-2">
                {isLoading && (
                    <div className="flex justify-center p-4">
                        <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
                    </div>
                )}
                {!isLoading &&
                    playlists?.pages
                        .flatMap((page) => page.items)
                        .map((playlist) => (
                            <Button
                                key={playlist.id}
                                variant="ghost"
                                className="w-full justify-start px-2 [&_svg]:size-5"
                                size="lg"
                                onClick={() => {
                                    if (playlist.containsVideo) {
                                        removeVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId,
                                        });
                                    } else {
                                        addVideo.mutate({
                                            playlistId: playlist.id,
                                            videoId,
                                        });
                                    }
                                }}
                                disabled={removeVideo.isPending || addVideo.isPending}
                            >
                                {playlist.containsVideo ? <SquareCheckIcon className="mr-3" /> : <SquareIcon className="mr-3" />}
                                {playlist.name}
                            </Button>
                        ))}
            </div>
            {!isLoading && (
                <InfiniteScroll isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage} isManual />
            )}
        </ResponsiveModal>
    );
};
export default PlaylistAddModal;
