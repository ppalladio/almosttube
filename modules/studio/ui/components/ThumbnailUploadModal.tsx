import ResponsiveModal from '@/components/ResponsiveModal';
import { UploadDropzone } from '@/lib/uploadthing';
import { trpc } from '@/trpc/client';

interface ThumbnailUploadModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}
const ThumbnailUploadModal = ({ videoId, open, onOpenChange }: ThumbnailUploadModalProps) => {
    const utils = trpc.useUtils();
    const onUploadComplete = () => {
        utils.studio.getMany.invalidate();
        utils.studio.getOne.invalidate({ id: videoId });
        onOpenChange(false);
    };
    return (
        <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
            <UploadDropzone endpoint="thumbnailUploader" input={{ videoId }} onClientUploadComplete={onUploadComplete} />
        </ResponsiveModal>
    );
};
export default ThumbnailUploadModal;
