import { AlertTriangleIcon } from 'lucide-react';
import { VideoGetOneOutput } from '../../type';

interface VideoBannerProps {
    status: VideoGetOneOutput['muxStatus'];
}
const VideoBanner = ({ status }: VideoBannerProps) => {
    if (status === 'ready') {
        return null;
    }
    return (
        <div className="bg-yellow-500 py-3 px-4 rounded-b-xl flex items-center gap-2">
            <AlertTriangleIcon className="size-4 text-black shrink-0" />
            <p className="text-xs text-black md:text-sm font-medium line-clamp-1 ">The video is being processed</p>
        </div>
    );
};
export default VideoBanner;
