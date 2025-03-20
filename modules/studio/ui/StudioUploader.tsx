import MuxUploader from '@mux/mux-uploader-react';
interface StudioUploaderProps {
    endpoint?: string | null;
    onSuccess?: () => void;
}
const StudioUploader = ({ endpoint, onSuccess }: StudioUploaderProps) => {
    return (
        <div>
            <MuxUploader endpoint={endpoint} />
        </div>
    );
};
export default StudioUploader;
 