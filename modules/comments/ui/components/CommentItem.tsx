import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/UserAvatar';
import { useAuth, useClerk } from '@clerk/nextjs';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { CommentGetManyOutput } from '../../types';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { trpc } from '@/trpc/client';
import { ChevronDownIcon, ChevronUpIcon, MessagesSquareIcon, MoreVerticalIcon, ThumbsDownIcon, ThumbsUpIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CommentForm from './CommentForm';
import CommentReplies from './CommentReplies';
interface CommentItemProps {
    comment: CommentGetManyOutput['items'][number];
    variant?: 'reply' | 'comment';
}
const CommentItem = ({ comment, variant = 'comment' }: CommentItemProps) => {
    const { userId } = useAuth();
    const clerk = useClerk();
    const utils = trpc.useUtils();
    const [isReplyOpen, setIsReplyOpen] = useState(false);
    const [isRepliesOpen, setIsRepliesOpen] = useState(false);

    const remove = trpc.comments.remove.useMutation({
        onSuccess: () => {
            toast.success('Comment removed');
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error('Something went wrong');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });

    const like = trpc.commentReactions.like.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error('Something went wrong');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });

    const dislike = trpc.commentReactions.dislike.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId: comment.videoId });
        },
        onError: (error) => {
            toast.error('Something went wrong');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });
    return (
        <div>
            <div className="flex gap-4">
                <Link prefetch href={`/users/${comment.userId}`}>
                    <UserAvatar size={variant === 'comment' ? 'lg' : 'sm'} imgUrl={comment.user.imageUrl} name={comment.user.name} />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link prefetch href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-1 5">
                            <span className="font-medium text-sm pb-0 5">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>

                    <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center">
                            <Button
                                className="size-8"
                                disabled={like.isPending}
                                variant="ghost"
                                size="icon"
                                onClick={() => like.mutate({ commentId: comment.id })}
                            >
                                <ThumbsUpIcon className={cn(comment.viewerReaction === 'like' && 'fill-black')} />
                            </Button>
                            <span className="text-xs text-muted-foreground ">{comment.likeCount}</span>

                            <Button
                                className="size-8"
                                disabled={dislike.isPending}
                                variant="ghost"
                                size="icon"
                                onClick={() => dislike.mutate({ commentId: comment.id })}
                            >
                                <ThumbsDownIcon className={cn(comment.viewerReaction === 'dislike' && 'fill-black')} />
                            </Button>
                            <span className="text-xs text-muted-foreground ">{comment.dislikeCount}</span>
                            {variant === 'comment' && (
                                <Button className="h-8" size={'sm'} variant={'ghost'} onClick={() => setIsReplyOpen(true)}>
                                    Reply
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                {/* todo render the dropdown conditionally */}
                {/* {comment.user.clerkId !== userId && variant === 'comment' && ( */}
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setIsReplyOpen(true)}>
                            <MessagesSquareIcon className="size-4" />
                            Reply
                        </DropdownMenuItem>
                        {comment.user.clerkId === userId && (
                            <DropdownMenuItem onClick={() => remove.mutate({ id: comment.id })}>
                                <Trash2Icon className="size-4" />
                                Delete
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* )} */}
            </div>
            {isReplyOpen && variant === 'comment' && (
                <div className="mt-4 pl-14">
                    <CommentForm
                        variant="reply"
                        parentId={comment.id}
                        onCancel={() => setIsReplyOpen(false)}
                        videoId={comment.videoId}
                        onSuccess={() => {
                            setIsRepliesOpen(true);
                            setIsReplyOpen(false);
                        }}
                    />
                </div>
            )}
            {comment.replyCount > 0 && variant === 'comment' && (
                <div className="pl-14">
                    <Button size={'sm'} variant="tertiary" onClick={() => setIsRepliesOpen((current) => !current)}>
                        {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        {comment.replyCount} replies
                    </Button>
                </div>
            )}
            {comment.replyCount > 0 && variant === 'comment' && isRepliesOpen && <CommentReplies parentId={comment.id} videoId={comment.videoId} />}
        </div>
    );
};
export default CommentItem;
