import PlaylistHeader from '../section/PlaylistHeader';
import VideosSection from '../section/VideosSection';

interface VideosViewProps {
    playlistId: string;
}
export const VideosView = ({ playlistId }: VideosViewProps) => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <PlaylistHeader playlistId={playlistId} />
            <VideosSection playlistId={playlistId} />
        </div>
    );
};
