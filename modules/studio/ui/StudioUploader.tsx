import { Button } from '@/components/ui/button';
import MuxUploader, { MuxUploaderDrop, MuxUploaderFileSelect, MuxUploaderProgress, MuxUploaderStatus } from '@mux/mux-uploader-react';
import { UploadIcon } from 'lucide-react';
interface StudioUploaderProps {
    endpoint?: string | null;
    onSuccess?: () => void;
}
const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
    return (
        <div>
            <MuxUploader endpoint={endpoint} id="video-uploader" className="hidden group/uploder" />
            <MuxUploaderDrop muxUploader="video-uploader" className="group/drop">
                <div slot="heading" className="flex flex-col items-center gap-6">
                    <div className="flex   items-center justify-center   rounded-full gap-6 bg-muted h-32 w-32">
                        <UploadIcon className="size-10 text-muted-foreground group/drop-[&[active]]:animate-bounce transition-all duration-300" />
                    </div>
                    <div className="flex flex-col gap-2 text-center">
                        <p className="text-sm">Drag and drop videos files to upload</p>
                        <p className="text-xs text-muted-foreground">Your videos will be private until you publish them</p>
                    </div>
                    <MuxUploaderFileSelect muxUploader="video-uploader">
                        <Button type={'button'} className="rounded-full">
                            Select Files
                        </Button>
                    </MuxUploaderFileSelect>
                </div>
                <span slot="separator" className="hidden" />
                <MuxUploaderStatus muxUploader="video-uploader" className="text-sm" />
                <MuxUploaderProgress muxUploader="video-uploader" className="text-sm " type="percentage" />
                <MuxUploaderProgress muxUploader="video-uploader" className="text-sm " type="bar" />
            </MuxUploaderDrop>
        </div>
    );
};
export default StudioUploader;
