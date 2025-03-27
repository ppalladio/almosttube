import MuxPlayer from '@mux/mux-player-react';
interface VideoPlayerProps {
    playbackId?: string;
    thumbnailId?: string;
    autoPlay?: boolean;
    onPlay?: () => void;
}
const VideoPlayer = ({ playbackId, thumbnailId, autoPlay, onPlay }: VideoPlayerProps) => {
    if (!playbackId) return null;
    return (
        <MuxPlayer
            playbackId={playbackId ?? ''}
            // TODO change to real placeholder pics
            poster={thumbnailId ?? '/next.svg'}
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
