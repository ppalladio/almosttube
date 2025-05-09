import { Skeleton } from '@/components/ui/skeleton';
import { thumbnailPlaceholder } from '@/lib/constants';
import { formattedDuration } from '@/lib/utils';
import Image from 'next/image';

interface VideoThumbnailProps {
    title: string;
    duration: number;
    imgUrl?: string;
    previewUrl?: string;
}

export const VideoThumbnailSkeleton = () => {
    return (
        <div className="relative w-full overflow-hidden aspect-video transition-all  ">
            <Skeleton className="size-full" />
        </div>
    );
};
const VideoThumbnail = ({ imgUrl, previewUrl, title, duration }: VideoThumbnailProps) => {
    return (
        <div className="relative">
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image src={imgUrl || thumbnailPlaceholder} alt={title} fill className="h-full w-full object-cover" />
                <Image
                    unoptimized={!!previewUrl}
                    src={previewUrl || thumbnailPlaceholder}
                    alt={title}
                    fill
                    className="h-full w-full object-cover opacity-0 group-hover:opacity-100"
                />
            </div>
            <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium">
                {formattedDuration(duration)}
            </div>
        </div>
    );
};
export default VideoThumbnail;
