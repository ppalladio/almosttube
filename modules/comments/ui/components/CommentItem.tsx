import Link from 'next/link';
import { CommentGetManyOutput } from '../../types';
import UserAvatar from '@/components/UserAvatar';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useAuth, useClerk } from '@clerk/nextjs';

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MessagesSquareIcon, MoreVerticalIcon, Trash2Icon } from 'lucide-react';
import { trpc } from '@/trpc/client';
import { toast } from 'sonner';
interface CommentItemProps {
    comment: CommentGetManyOutput['items'][number];
}
const CommentItem = ({ comment }: CommentItemProps) => {
    const { userId } = useAuth();
    const clerk = useClerk();
    const utils = trpc.useUtils();
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
    return (
        <div>
            <div className="flex gap-4">
                <Link href={`/users/${comment.userId}`}>
                    <UserAvatar size="lg" imgUrl={comment.user.imageUrl} name={comment.user.name} />
                </Link>
                <div className="flex-1 min-w-0">
                    <Link href={`/users/${comment.userId}`}>
                        <div className="flex items-center gap-2 mb-1 5">
                            <span className="font-medium text-sm pb-0 5">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                        </div>
                    </Link>
                    <p className="text-sm">{comment.value}</p>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreVerticalIcon />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {}}>
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
            </div>
        </div>
    );
};
export default CommentItem;
