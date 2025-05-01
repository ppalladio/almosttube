import { thumbnailPlaceholder } from '@/lib/constants';
import MuxPlayer from '@mux/mux-player-react';
interface VideoPlayerProps {
    playbackId?: string;
    thumbnailUrl?: string;
    autoPlay?: boolean;
    onPlay?: () => void;
}

export const VideoPlayerSkeleton = () => {
    return <div className="aspect-video rounded-xl bg-black" />;
};
const VideoPlayer = ({ playbackId, thumbnailUrl, autoPlay, onPlay }: VideoPlayerProps) => {
    if (!playbackId) return null;
    return (
        <MuxPlayer
            playbackId={playbackId ?? ''}
            poster={thumbnailUrl || thumbnailPlaceholder}
            autoPlay={autoPlay}
            playerInitTime={0}
            thumbnailTime={0}
            className="w-full h-full object-contain"
            accentColor="#ff2056"
            onPlay={onPlay}
        />
    );
};
export default VideoPlayer;
