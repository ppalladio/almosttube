'use client';

import ResponsiveModal from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { trpc } from '@/trpc/client';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { toast } from 'sonner';
import StudioUploader from '../StudioUploader';

const StudioUploadModal = () => {
    const utils = trpc.useUtils();
    const create = trpc.videos.create.useMutation({
        // revalidate after upload is successful
        onSuccess: () => {
            toast.success('Video uploaded successfully');
            utils.studio.getMany.invalidate();
        },
        onError: (error) => toast.error(error.message),
    });
    return (
        <>
            <ResponsiveModal title="uploader" open={!!create.data?.url} onOpenChange={() => create.reset()}>
                {create.data?.url ? <StudioUploader endpoint={create.data.url} onSuccess={() => {}} /> : <Loader2Icon />}
            </ResponsiveModal>
            <Button variant={'secondary'} onClick={() => create.mutate()} disabled={create.isPending}>
                {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
                Create
            </Button>
        </>
    );
};
export default StudioUploadModal;
