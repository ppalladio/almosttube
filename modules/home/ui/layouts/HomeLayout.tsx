import { SidebarProvider } from '@/components/ui/sidebar';
import HomeNavbar from '../components/home-navbar';
import HomeSidebar from '@/modules/home/ui/components/home-sidebar';
export const dynamic = 'force-dynamic';

interface HomeLayoutProps {
    children: React.ReactNode;
}
export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <SidebarProvider>
            <div className=" w-full">
                <HomeNavbar />
                home navbar
                <div className="flex min-h-screen pt-[4rem]">
                    <HomeSidebar />
                    <main className="flex-1 overflow-y-hidden">{children}</main>
                </div>
            </div>
        </SidebarProvider>
    );
};
