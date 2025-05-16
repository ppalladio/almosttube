import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { useClerk } from '@clerk/nextjs';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { toast } from 'sonner';
import { VideoGetOneOutput } from '../../type';
interface VideoReactionProps {
    videoId: string;
    likes: number;
    dislikes: number;
    viewerReaction: VideoGetOneOutput['viewerReaction'];
}
const VideoReaction = ({ videoId, likes, dislikes, viewerReaction }: VideoReactionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const like = trpc.videoReactions.like.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: videoId });
            utils.playlist.getLiked.invalidate();
        },
        onError: (error) => {
            toast.error('You need to sign in first');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });
    const dislike = trpc.videoReactions.dislike.useMutation({
        onSuccess: () => {
            utils.videos.getOne.invalidate({ id: videoId });
            utils.playlist.getLiked.invalidate();
        },
        onError: (error) => {
            toast.error('You need to sign in first');
            console.log(error.data?.code);
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });

    return (
        <div className="flex items-center flex-none">
            <Button
                className="rounded-l-full rounded-r-none gap-2 pr-4"
                variant={'secondary'}
                onClick={() => like.mutate({ videoId })}
                disabled={like.isPending}
            >
                <ThumbsUp className={cn('size-5', viewerReaction === 'like' && 'fill-black')} />
                {likes}
            </Button>
            <Separator orientation="vertical" className="h-7" />

            <Button
                className="rounded-l-none rounded-r-full gap-2 pl-4"
                variant={'secondary'}
                onClick={() => dislike.mutate({ videoId })}
                disabled={dislike.isPending}
            >
                <ThumbsDown className={cn('size-5', viewerReaction === 'dislike' && 'fill-black')} />
                {dislikes}
            </Button>
        </div>
    );
};
export default VideoReaction;
