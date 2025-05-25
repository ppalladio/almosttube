import { SidebarTrigger } from '@/components/ui/sidebar';
import AuthButton from '@/modules/auth/ui/components/AuthButton';
import Image from 'next/image';
import Link from 'next/link';
import StudioUploadModal from '../StudioUploadModal';

const StudioNavbar = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
            <div className="flex items-center gap-4 w-full">
                {/* menu and logo */}

                <div className="flex items-center flex-shrink-0">
                    <SidebarTrigger />
                    <Link prefetch href="/studio" className="hidden md:block">
                        <div className="p-4 flex items-center gap-1">
                            <Image alt="logo" src="/next.svg" height={50} width={50} />
                            <p className="text-xl font-semibold tracking-tight">Studio</p>
                        </div>
                    </Link>
                </div>

                <div className="flex-1" />
                <div className="flex-shrink-0 items-center flex gap-4">
                    <StudioUploadModal />
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};
export default StudioNavbar;
