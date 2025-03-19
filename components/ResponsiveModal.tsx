import { useIsMobile } from '@/hooks/use-mobile';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from './ui/drawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface ResponsiveModalProps {
    children: React.ReactNode;
    open: boolean;
    title: string;
    onOpenChange: (open: boolean) => void;
}
const ResponsiveModal = ({ children, open, title, onOpenChange }: ResponsiveModalProps) => {
    const isMobile = useIsMobile();
    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                    </DrawerHeader>
                    {children}
                </DrawerContent>
            </Drawer>
        );
    }
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                    <DialogTitle>{title}</DialogTitle>
                <DialogHeader>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};
export default ResponsiveModal;
