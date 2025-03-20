import { formattedDuration } from '@/lib/utils';
import Image from 'next/image';

interface VideoThumbnailProps {
    title: string;
    duration: number;
    imgUrl?: string | '';
    previewUrl?: string | '';
}
const VideoThumbnail = ({ imgUrl, previewUrl, title, duration }: VideoThumbnailProps) => {
    return (
        <div className="relative">
            <div className="relative w-full overflow-hidden rounded-xl aspect-video">
                <Image src={imgUrl ?? '/vercel.svg'} alt={title} fill className="h-full w-full object-cover" />
                <Image
                    unoptimized={!!previewUrl}
                    src={previewUrl ?? '/vercel.svg'}
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
