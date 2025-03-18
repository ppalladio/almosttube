'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
const VideoSection = () => {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <VideoSectionSuspense />
            </ErrorBoundary>
        </Suspense>
    );
};
const VideoSectionSuspense = () => {
    const [data, query] = trpc.studio.getMany.useSuspenseInfiniteQuery({ limit: 5 }, { getNextPageParam: (lastPage) => lastPage.nextCursor });

    return (
        <div>
            <div className="border-y">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="pl-6 w-[510px]">Video</TableHead>
                            <TableHead>Visibility</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right ">Views</TableHead>
                            <TableHead className="text-right ">Comments</TableHead>
                            <TableHead className="text-right pr-6">Likes</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.pages
                            .flatMap((page) => page.items)
                            .map((video) => (
                                // tr cant be inside of a tag for latest ver
                                <Link href={`/studio/video/${video.id}`} key={video.id} legacyBehavior>
                                    <TableRow className="cursor-pointer">
                                        <TableCell>{video.title}</TableCell>
                                        <TableCell>Visibility</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Date </TableCell>
                                        <TableCell>Views</TableCell>
                                        <TableCell>Comments</TableCell>
                                        <TableCell>Links</TableCell>
                                    </TableRow>
                                </Link>
                            ))}
                    </TableBody>
                </Table>
            </div>
            <InfiniteScroll
                hasNextPage={query.hasNextPage}
                isFetchingNextPage={query.isFetchingNextPage}
                fetchNextPage={query.fetchNextPage}
                isManual
            />
        </div>
    );
};
export default VideoSection;
