import { VIdeoGetManyOutput } from '../../type';
import VideoInfo from './VideoInfo';
import VideoThumbnail from './VideoThumbnail';
import Link from 'next/link';
interface VideoGridCardProps {
    data: VIdeoGetManyOutput['items'][number];
    onRemove?: () => void;
}
const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/video/${data.id}`}>
                <VideoThumbnail
                    imgUrl={data.muxThumbnailUrl || undefined}
                    previewUrl={data.muxPreviewUrl || undefined}
                    title={data.title}
                    duration={data.duration}
                />
            </Link>
            <VideoInfo data={data} onRemove={onRemove} />
        </div>
    );
};
export default VideoGridCard;
