'use client';

import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

interface StudioUploadModalProps {}
const StudioUploadModal = ({}: StudioUploadModalProps) => {
    return (
        <Button variant={'secondary'}>
            <PlusIcon />
            Create
        </Button>
    );
};
export default StudioUploadModal;
