import { VIdeoGetManyOutput } from '../../type';
import VideoInfo, { VideoInfoSkeleton } from './VideoInfo';
import VideoThumbnail, { VideoThumbnailSkeleton } from './VideoThumbnail';
import Link from 'next/link';
interface VideoGridCardProps {
    data: VIdeoGetManyOutput['items'][number];
    onRemove?: () => void;
}
export const VideoGridCardSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full ">
			<VideoThumbnailSkeleton /> 
			<VideoInfoSkeleton />
		</div>
	);
}
const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
    return (
        <div className="flex flex-col gap-2 w-full group">
            <Link href={`/videos/${data.id}`}>
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
