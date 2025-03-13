'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { History, ListVideoIcon, ThumbsUp } from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';

import Link from 'next/link';

const items = [
    {
        title: 'History',
        url: '/playlists/history',
        icon: History,
    },
    {
        title: 'Liked Videos',
        url: '/playlists/liked',
        icon: ThumbsUp,
        auth: true,
    },
    {
        title: 'All Playlists',
        url: '/playlists',
        icon: ListVideoIcon,
        auth: true,
    },
];
export const PersonalSection = () => {
    const { userId, isSignedIn } = useAuth();
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
                                isActive={false}
                                onClick={(e) => {
                                    if (!isSignedIn && item.auth) {
                                        e.preventDefault();
                                        return clerk.openSignIn();
                                    }
                                }}
                            >
                                <Link href={item.url} className="flex  items-center gap-4 ">
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
