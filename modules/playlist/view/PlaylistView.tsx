'use client';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import PlaylistCreateModal from '../ui/components/PlaylistCreateModal';
import PlaylistSection from '../ui/section/PlaylistSection';

export const PlaylistView = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <PlaylistCreateModal open={open} onOpenChange={setOpen} />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold">Your playlists</h1>
                    <p className="text-xs text-muted-foreground">Collection of your videos</p>
                </div>
                <Button variant="outline" size="icon" className="rounded-full" onClick={() => setOpen(true)}>
                    <PlusIcon className="w-4 h-4" />
                </Button>
            </div>
            <PlaylistSection />
        </div>
    );
};
