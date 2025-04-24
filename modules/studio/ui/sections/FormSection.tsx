'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { videoUpdateSchema } from '@/db/schema';
import { trpc } from '@/trpc/client';
import {
    CopyCheckIcon,
    CopyIcon,
    Globe2Icon,
    ImagePlusIcon,
    Loader2Icon,
    LockIcon,
    MoreVerticalIcon,
    RotateCcwIcon,
    SparkleIcon,
    SparklesIcon,
    TrashIcon,
} from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import VideoPlayer from '@/modules/videos/ui/components/VideoPlayer';
import Link from 'next/link';
import { snakeCaseToTitle } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ThumbnailUploadModal from '../components/ThumbnailUploadModal';
import { thumbnailPlaceholder } from '@/lib/constants';
import ThumbnailGenerateModal from '../components/ThumbnailGenerateModal';
import { Skeleton } from '@/components/ui/skeleton';
interface FormSectionProps {
    videoId: string;
}

export const FormSection = ({ videoId }: FormSectionProps) => {
    return (
        <Suspense fallback={<FormSectionSkeleton />}>
            <ErrorBoundary fallback={<div>Something went wrong</div>}>
                <FormSectionSuspense videoId={videoId} />
            </ErrorBoundary>
        </Suspense>
    );
};

const FormSectionSkeleton = () => {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-32" />
                    <Skeleton className="h-4  w-40" />
                </div>
                <Skeleton className="h-9 w-24" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="space-y-8 lg:col-span-3">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-[220px] w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-[84px] w-[153px]" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="flex flex-col gap-y-8 lg:col-span-2">
                    <div className="flex flex-col gap-4 rounded-xl overflow-hidden bg-[#f9f9f9]">
                        <Skeleton className="aspect-video" />
                    </div>
                </div>
            </div>
        </div>
    );
};
const FormSectionSuspense = ({ videoId }: FormSectionProps) => {
    const router = useRouter();
    const [thumbnailModalOpen, setThumbnailModalOpen] = useState(false);
    const [thumbnailGenerateModalOpen, setThumbnailGenerateModalOpen] = useState(false);
    const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId });
    const [categories] = trpc.categories.getMany.useSuspenseQuery();
    const utils = trpc.useUtils();
    const update = trpc.videos.update.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({ id: videoId });
            toast.success('Video updated successfully');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Something went wrong');
        },
    });

    const remove = trpc.videos.remove.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            toast.success('Video removed');
            router.push('/studio');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Something went wrong');
        },
    });
    const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
        onSuccess: () => {
            utils.studio.getMany.invalidate();
            utils.studio.getOne.invalidate({ id: videoId });
            toast.success('Thumbnail restored');
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });
    const form = useForm<z.infer<typeof videoUpdateSchema>>({
        resolver: zodResolver(videoUpdateSchema),
        defaultValues: video,
    });

    // ai generation jobs

    const generateTitle = trpc.videos.generateTitle.useMutation({
        onSuccess: () => {
            toast.success('Background job started', {
                description: 'This might take some time',
            });
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });
    const generateDescription = trpc.videos.generateDescription.useMutation({
        onSuccess: () => {
            toast.success('Background job started', {
                description: 'This might take some time',
            });
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });

    // could be not async and use update.mutate
    const onSubmit = async (data: z.infer<typeof videoUpdateSchema>) => {
        await update.mutateAsync(data);
    };
    //  TODO change for deployment outside of vercel
    const videoUrl = `${process.env.VERCEL_URL ?? 'http://localhost:3000'}/studio/videos/${videoId}`;
    const [isCopied, setIsCopied] = useState(false);

    const onClickSave = () => {
        try {
            router.push(`/studio`);
        } catch (error) {
            console.error(error);
            toast.error('something went wrong, please try again later');
        } finally {
            router.push(`/studio`);
        }
    };
    const onCopy = async () => {
        await navigator.clipboard.writeText(videoUrl);
        setIsCopied(true);
        toast.success('Copied to clipboard');
        setTimeout(() => {
            setIsCopied(false);
        }, 2000);
    };
	
    return (
        <>
            {/* TODO THUMBNAIL IS NOT WORKING */}
            <ThumbnailUploadModal open={thumbnailModalOpen} onOpenChange={setThumbnailModalOpen} videoId={videoId} />
            <ThumbnailGenerateModal open={thumbnailGenerateModalOpen} onOpenChange={setThumbnailGenerateModalOpen} videoId={videoId} />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex items-center justify-between   mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Video details</h1>
                            <p className="text-xs text-muted-foreground ">Manage your video details</p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <Button
                                type="submit"
                                disabled={update.isPending}
                                onClick={() => {
                                    onClickSave();
                                }}
                            >
                                Save
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'ghost'} size={'icon'}>
                                        <MoreVerticalIcon />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" side="bottom">
                                    <DropdownMenuItem onClick={() => remove.mutate({ id: videoId })}>
                                        <TrashIcon className="size-4 mr-2" /> Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                        <div className="space-y-6 lg:col-span-3">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Title
                                            <div className="flex items-center gap-x-2">
                                                <Button
                                                    className="rounded-full size-6 [&_svg]:size-3"
                                                    onClick={() => generateTitle.mutate({ id: videoId })}
                                                    disabled={generateTitle.isPending || !video.muxTrackId}
                                                    variant="outline"
                                                    size="icon"
                                                    type="button"
                                                >
                                                    {generateTitle.isPending ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
                                                </Button>
                                            </div>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="add a title to your video" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description
                                            <div className="flex items-center gap-x-2">
                                                <Button
                                                    className="rounded-full size-6 [&_svg]:size-3"
                                                    onClick={() => generateDescription.mutate({ id: videoId })}
                                                    disabled={generateDescription.isPending || !video.muxTrackId}
                                                    variant="outline"
                                                    size="icon"
                                                    type="button"
                                                >
                                                    {generateDescription.isPending ? <Loader2Icon className="animate-spin" /> : <SparklesIcon />}
                                                </Button>
                                            </div>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value ?? ''}
                                                rows={10}
                                                className="resize-none pr-10"
                                                placeholder="add a description to your video"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                name="muxThumbnailUrl"
                                control={form.control}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Thumbnail</FormLabel>
                                        <FormControl>
                                            <div className="p-0.5 border border-dashed border-neutral-400 relative group  h-[84px]  w-[153px] ">
                                                <Image
                                                    src={video.muxThumbnailUrl || thumbnailPlaceholder}
                                                    fill
                                                    alt="thumbnail"
                                                    className="object-cover"
                                                />
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            size="icon"
                                                            className="bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7"
                                                        >
                                                            <MoreVerticalIcon className="text-white" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="start" side="right">
                                                        <DropdownMenuItem onClick={() => setThumbnailModalOpen(true)}>
                                                            <ImagePlusIcon className="size-4 mr-1" />
                                                            Change
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => setThumbnailGenerateModalOpen(true)}>
                                                            <SparkleIcon className="size-4 mr-1" onClick={() => {}} />
                                                            AI-Generated
                                                        </DropdownMenuItem>

                                                        <DropdownMenuItem onClick={() => restoreThumbnail.mutate({ id: videoId })}>
                                                            <RotateCcwIcon className="size-4 mr-1" onClick={() => {}} />
                                                            Restore
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-y-8 lg:col-span-2">
                            <div className="flex flex-col gap-4 bg-[#f9f9f9]  rounded-xl overflow-hidden h-fit">
                                <div className="aspect-video overflow-hidden relative">
                                    <VideoPlayer playbackId={video.muxPlaybackId ?? ''} thumbnailId={video.muxThumbnailUrl ?? ''} />
                                </div>
                                <div className="p-4 flex flex-col gap-y-6">
                                    <div className="flex justify between items-center gap-x-2">
                                        <div className="flex flex-col gap-y-2">
                                            <p className="text-muted-foreground text-xs">Video Link</p>
                                            <div className="flex items-center gap-x-2">
                                                <Link href={`/video/${video.id}`}>
                                                    {/*  TODO change localhost */}
                                                    <p
                                                        className="line-clamp-1 text-sm 
													text-blue-500"
                                                    >
                                                        localhost:xxx
                                                    </p>
                                                </Link>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0"
                                                    onClick={onCopy}
                                                    disabled={isCopied}
                                                >
                                                    {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col gap-y-1">
                                            <p className="text-muted-foreground text-xs ">Video Status</p>
                                            <p className="text-sm font-bold">{snakeCaseToTitle(video.muxStatus ?? 'Preparing')}</p>

                                            <p className="text-muted-foreground text-xs ">Subtitle Status</p>
                                            <p className="text-sm font-bold">{snakeCaseToTitle(video.muxTrackStatus ?? 'Preparing')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <FormField
                                control={form.control}
                                name="visibility"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value ?? undefined}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Visibility" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="public">
                                                    <div className="flex items-center">
                                                        <Globe2Icon className="size-4 mr-2" />
                                                        Public
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="private">
                                                    <div className="flex items-center">
                                                        <LockIcon className="size-4 mr-2" />
                                                        Private
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            ></FormField>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    );
};
export default FormSection;
