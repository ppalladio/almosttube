import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

const VideoReaction = () => {
    const viewerReaction: string = 'like';

    return (
        <div className="flex items-center flex-none">
            <Button className="rounded-l-full rounded-r-none gap-2 pr-4" variant={'secondary'}>
                <ThumbsUp className={cn('size-5', viewerReaction === 'like' && 'fill-black')} />
                {1}
            </Button>
            <Separator orientation="vertical" className="h-7" />

            <Button className="rounded-l-none rounded-r-full gap-2 pl-4" variant={'secondary'}>
                <ThumbsDown className={cn('size-5', viewerReaction !== 'like' && 'fill-black')} />
                {1}
            </Button>
        </div>
    );
};
export default VideoReaction;
