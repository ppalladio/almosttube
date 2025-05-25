'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth, useClerk } from '@clerk/nextjs';
import { History, ListVideoIcon, ThumbsUp } from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const items = [
    {
        title: 'History',
        url: '/playlist/history',
        icon: History,
    },
    {
        title: 'Liked Videos',
        url: '/playlist/liked',
        icon: ThumbsUp,
        auth: true,
    },
    {
        title: 'All Playlists',
        url: '/playlist',
        icon: ListVideoIcon,
        auth: true,
    },
];
export const PersonalSection = () => {
    const pathname = usePathname();
    const { isSignedIn } = useAuth();
    const clerk = useClerk();
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Personal Section</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                tooltip={item.title}
                                asChild
                                isActive={pathname === item.url}
                                onClick={(e) => {
                                    if (!isSignedIn && item.auth) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link prefetch href={item.url} className="flex  items-center gap-4 ">
                                    <item.icon />
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
