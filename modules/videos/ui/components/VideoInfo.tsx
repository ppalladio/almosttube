import { useMemo } from 'react';
import { VIdeoGetManyOutput } from '../../type';
import { formatDistanceToNow } from 'date-fns';
import UserAvatar from '@/components/UserAvatar';
import Link from 'next/link';
import UserInfo from '@/modules/users/ui/components/UserInfo';
import VideoMenu from './VideoMenu';
interface VideoInfoProps {
    data: VIdeoGetManyOutput['items'][number];
    onRemove?: () => void;
}
const VideoInfo = ({ data, onRemove }: VideoInfoProps) => {
    const compactViews = useMemo(() => {
        return Intl.NumberFormat('en-Gb', { notation: 'compact' }).format(data.viewCount);
    }, [data.viewCount]);
    const compactDate = useMemo(() => {
        return formatDistanceToNow(data.createdAt, { addSuffix: true });
    }, [data.createdAt]);

    return (
        <div className="flex gap-3">
            <Link href={`/users/${data.user.id}`}>
                <UserAvatar imgUrl={data.user.imageUrl} name={data.user.name} />
            </Link>
            <div className="min-w-0 flex-1">
                <Link href={`/video/${data.id}`}>
                    <h3 className="font-medium line-clamp-1 lg:line-clamp-2 text-base break-words">{data.title}</h3>
                </Link>
                <Link href={`/users/${data.user.id}`}>
                    <UserInfo name={data.user.name} />
                </Link>
                <Link href={`videos/${data.id}`}>
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
