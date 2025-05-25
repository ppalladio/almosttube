'use client';
import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { LogOutIcon, VideoIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
                                <Link prefetch href={'/studio'}>
                                    <VideoIcon size={5} />
                                    <span className="text-sm">Content</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <Separator />
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip="Exit Studio">
                                <Link prefetch href={'/'}>
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
