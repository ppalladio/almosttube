import Link from 'next/link';
import { PlaylistGetManyOutput } from '../../type';
import PlaylistInfo, { PlaylistInfoSkeleton } from './PlaylistInfo';
import PlaylistThumbnail, { PlaylistThumbnailSkeleton } from './PlaylistThumbnail';

interface PlaylistGridCardProps {
    data: PlaylistGetManyOutput['items'][number];
}

export const PlaylistGridCardSkeleton = () => {
    return (
        <div className="flex flex-col gap-2 w-full">
            <PlaylistThumbnailSkeleton />
            <PlaylistInfoSkeleton />
        </div>
    );
};
const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
    return (
        <div>
            <Link href={`/playlist/${data.id}`}>
                <div className="flex flex-col gap-2 w-full group">
                    <PlaylistThumbnail imgUrl={'/placeholder_img.png'} title={data.name} videoCount={data.videoCount} />
                    <PlaylistInfo data={data} />
                </div>
            </Link>
        </div>
    );
};
export default PlaylistGridCard;
