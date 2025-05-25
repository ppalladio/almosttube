import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import UserInfo from '@/modules/users/ui/components/UserInfo';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { useMemo } from 'react';
import { VIdeoGetManyOutput } from '../../type';
import VideoMenu from './VideoMenu';
interface VideoInfoProps {
    data: VIdeoGetManyOutput['items'][number];
    onRemove?: () => void;
}

export const VideoInfoSkeleton = () => {
    return (
        <div className="flex gap-3">
            <Skeleton className="size-10 rounded-full shrink-0" />
            <div className="min-w-0 flex-1 space-y">
                <Skeleton className="h-5 w-[90%] " />
                <Skeleton className="h-5 w-[70%] " />
                <Skeleton />
            </div>
        </div>
    );
};
const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en-Gb', { notation: 'compact' }).format(data.viewCount);
    }, [data.viewCount]);
    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, { addSuffix: true });
    }, [data.createdAt]);

    return (
        <div className="flex gap-3">
            <Link prefetch href={`/users/${data.user.id}`}>
                <UserAvatar imgUrl={data.user.imageUrl} name={data.user.name} />
            </Link>
            <div className="min-w-0 flex-1">
                <Link prefetch href={`/videos/${data.id}`}>
                    <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">{data.title}</h3>
                </Link>
                <Link prefetch href={`/users/${data.user.id}`}>
                    <UserInfo name={data.user.name} />
                </Link>
                <Link prefetch href={`/videos/${data.id}`}>
                    <p>
                        {compactViews} views {compactDate}
                    </p>
                </Link>
            </div>
            <div className="flex-shrink-0">
                <VideoMenu videoId={data.id} onRemove={onRemove} />
            </div>
        </div>
    );
};
export default VideoInfo;
