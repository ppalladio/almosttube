'use client';
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import Link from 'next/link';
import { LogOutIcon, VideoIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import StudioSidebarHeader from './StudioSidebarHeader';

const StudioSidebar = () => {
    const pathname = usePathname();
    return (
        <Sidebar className="pt-16 z-4 " collapsible="icon">
            <SidebarContent className="bg-background">
                <SidebarGroup>
                    <SidebarMenu>
                        <StudioSidebarHeader />
                        <SidebarMenuItem>
                            <SidebarMenuButton isActive={pathname === '/studio'} asChild tooltip="Exit Studio">
                                <Link href={'/studio'}>
                                    <VideoIcon size={5} />
                                    <span className="text-sm">Content</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <Separator />
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Exit Studio">
                                <Link href={'/'}>
                                    <LogOutIcon size={5} />
                                    <span className="text-sm">Exit Studio</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
};
export default StudioSidebar;
