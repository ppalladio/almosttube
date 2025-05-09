import { cva, VariantProps } from 'class-variance-authority';
import { VIdeoGetManyOutput } from '../../type';
import Link from 'next/link';
import VideoThumbnail, { VideoThumbnailSkeleton } from './VideoThumbnail';
import { cn } from '@/lib/utils';
import UserAvatar from '@/components/UserAvatar';
import UserInfo from '@/modules/users/ui/components/UserInfo';
import { Tooltip, TooltipTrigger } from '@/components/ui/tooltip';
import { TooltipContent } from '@radix-ui/react-tooltip';
import VideoMenu from './VideoMenu';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const videoRowCardVariants = cva('group flex min-w-0', {
    variants: {
        size: {
            default: 'gap-4',
            compact: 'gap-2',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

const thumbnailVariants = cva('relative flex-none', {
    variants: {
        size: {
            default: 'w-[38%]',
            compact: ' w-[168px]',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

interface VideoRowCardProps extends VariantProps<typeof videoRowCardVariants> {
    data: VIdeoGetManyOutput['items'][number];
    onRemove?: () => void;
}

export const VideoRowCardSkeleton = ({ size }: VariantProps<typeof videoRowCardVariants>) => {
    return (
        <div className={videoRowCardVariants({ size })}>
            <div className={thumbnailVariants({ size })}>
                <VideoThumbnailSkeleton />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-x-2">
                    <div className="flex-1 min-w-0">
                        <Skeleton className={cn('h-5 w-[40%]', size === 'compact' && 'h-4 w-[40%]')} />
                        {size === 'default' && (
                            <>
                                <Skeleton className="h-4 w-[20%] mt-1" />
                                <div className="flex items-center gap-2 my-3">
                                    <Skeleton className="size-9 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </>
                        )}
                        {size === 'compact' && (
                            <>
                                <Skeleton className="h-4 w-[50%] mt-1" />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
const VideoRowCard = ({ data, onRemove, size }: VideoRowCardProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en-Gb', { notation: 'compact' }).format(data.viewCount);
    }, [data.viewCount]);
    const compactLikes = useMemo(() => {
        return Intl.NumberFormat('en-Gb', { notation: 'compact' }).format(data.likeCount);
    }, [data.likeCount]);
    return (
        <div className={videoRowCardVariants({ size })}>
            <Link href={`/videos/${data.id}`} className={thumbnailVariants({ size })}>
                <VideoThumbnail
                    imgUrl={data.muxThumbnailUrl || undefined}
                    previewUrl={data.muxPreviewUrl || undefined}
                    title={data.title}
                    duration={data.duration}
                />
            </Link>
            <div className="flex-1 min-w-">
                <div className="flex justify-between gap-x-2">
                    <Link href={`/videos/${data.id}`} className="flex-1 min-w-0">
                        <h3 className={cn('line-clamp-2 font-medium', size === 'compact' ? 'text-sm' : 'text-base')}>{data.title}</h3>
                        {size === 'default' && (
                            <div className="flex items-end justify-start   gap-3 text-xs text-muted-foreground mt-1">
                                <p>{compactViews} views</p>
                                <p>{compactLikes} likes</p>
                            </div>
                        )}
                        {size === 'default' && (
                            <>
                                <div className="flex items-center gap-2 my-3">
                                    <UserAvatar size="sm" imgUrl={data.user.imageUrl} name={data.user.name} />
                                    <UserInfo size="sm" name="data.user.name" />
                                </div>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <p className="text-xs text-muted-foreground w-fit line-clamp-2">{data.description ?? 'No description'}</p>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" align="center" className="bg-black=70">
                                        <p>From video description</p>
                                    </TooltipContent>{' '}
                                </Tooltip>
                            </>
                        )}
                        {size === 'compact' && <UserInfo size="sm" name={data.user.name} />}
                        {size === 'compact' && (
                            <p className="text-xs text-muted-foreground mt-1">
                                {compactViews} views | {compactLikes} likes
                            </p>
                        )}
                    </Link>
                    <div className="flex-none">
                        <VideoMenu videoId={data.id} onRemove={onRemove} />
                    </div>
                </div>
            </div>
        </div>
    );
};
export default VideoRowCard;
