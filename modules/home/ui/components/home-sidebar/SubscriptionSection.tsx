'use client';

import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import { trpc } from '@/trpc/client';
import { ListIcon } from 'lucide-react';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
export const LoadingSkeleton = () => {
    return (
        <>
            {Array.from({ length: 4 }).map((i) => (
                <SidebarMenuItem key={i}>
                    <SidebarMenuButton disabled />
                    <div className="flex   items-center gap-4">
                        <Skeleton className="size-6 rounded-full shrink-0" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </SidebarMenuItem>
            ))}
        </>
    );
};
export const SubscriptionSection = () => {
    const pathname = usePathname();
    const { data, isLoading } = trpc.subscription.getMany.useInfiniteQuery(
        {
            limit: 10,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        },
    );
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    {isLoading && <LoadingSkeleton />}
                    {!isLoading &&
                        data?.pages.flatMap((page) =>
                            page.items.map((item) => (
                                <SidebarMenuItem key={`${item.creatorId}-${item.viewerId}`}>
                                    <SidebarMenuButton tooltip={item.user.name} asChild isActive={pathname === `/users/${item.user.id}`}>
                                        <Link href={`/users/${item.user.id}`} className="flex  items-center gap-4 ">
                                            <UserAvatar size="xs" imgUrl={item.user.imageUrl} name={item.user.name} />
                                            <span className="text-sm">{item.user.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )),
                        )}
                    {!isLoading && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={pathname === '/subscriptions'}>
                                <Link href={'/subscriptions'} className="flex  items-center gap-4 ">
                                    <ListIcon className="size-4" />
                                    <span>All Subscriptions</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
};
