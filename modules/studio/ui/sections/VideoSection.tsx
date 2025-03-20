'use client';

import InfiniteScroll from '@/components/InfiniteScroll';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { snakeCaseToTitle } from '@/lib/utils';
import VideoThumbnail from '@/modules/videos/ui/components/VideoThumbnail';
import { trpc } from '@/trpc/client';
import Link from 'next/link';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Globe2Icon, LockIcon } from 'lucide-react';
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
                                        <TableCell>
                                            <div className="flex items-center gap-4">
                                                <div className="relative aspect-video w-36 shrink-0">
                                                    <VideoThumbnail
                                                        imgUrl={video.muxThumbnailUrl ?? ''}
                                                        previewUrl={video.muxPreviewUrl ?? ''}
                                                        duration={video.duration ?? 0}
                                                        title={video.title}
                                                    />
                                                </div>
                                                <div className="flex flex-col overflow-hidden gap-y-1 ">
                                                    <span className="text-sm line-clamp-1">{video.title}</span>
                                                    <span className="text-xs line-clamp-1 text-muted-foreground">
                                                        {video.description ?? 'No description'}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="flex items-center">
                                            {video.visibility === 'private' ? (
                                                <LockIcon className="size-4 mr-2" />
                                            ) : (
                                                <Globe2Icon className="size-4 mr-2" />
                                            )}
                                            {snakeCaseToTitle(video.visibility)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center">{snakeCaseToTitle(video.muxStatus as string) ?? 'Error'}</div>
                                        </TableCell>
                                        <TableCell className="text-sm truncate">{format(new Date(video.createdAt), 'd MMM yyyy')} </TableCell>
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
