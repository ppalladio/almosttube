import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/UserAvatar';
import { trpc } from '@/trpc/client';
import { useClerk, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
	parentId: z.string().uuid().nullish(),
    videoId: z.string().uuid(),
    value: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface CommentFormProps {
    videoId: string;
    variant?: 'reply' | 'comment';
    parentId?: string;
    onSuccess?: () => void;
    onCancel?: () => void;
}

const CommentForm = ({ videoId, onSuccess, variant = 'comment', parentId, onCancel }: CommentFormProps) => {
    const { user } = useUser();
    const utils = trpc.useUtils();
    const clerk = useClerk();
    const create = trpc.comments.create.useMutation({
        onSuccess: () => {
            utils.comments.getMany.invalidate({ videoId });
            form.reset();
            toast.success('Comment added');
        },
        onError: (error) => {
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
            toast.error('Please sign in');
        },
    });
    // using defined formSchema instead of commentInsertSchema.omit({ userId: true })
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
			parentId: parentId,
            videoId,
            value: '',
        },
    });

    const handleSubmit = (data: FormData) => {
        create.mutate(data);
    };

    const handleCancel = () => {
        form.reset();
        onCancel?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex gap-4 group">
                <UserAvatar size="lg" imgUrl={user?.imageUrl || 'placeholder_img.png'} name={user?.username || 'User'} />
                <div className="flex-1">
                    <div>
                        <FormField
                            name="value"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder={variant === 'reply' ? 'Reply to this comment' : 'Add a comment'}
                                            className="resize-none bg-transparent overflow-hidden min-h-0"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="justify-end gap-2 mt-2 flex">
                        {onCancel && (
                            <Button variant="ghost" type={'button'} onClick={handleCancel}>
                                Cancel
                            </Button>
                        )}
                        <Button type="submit" size={'sm'} disabled={create.isPending}>
                            {variant === 'reply' ? 'Reply' : 'Comment'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
};

export default CommentForm;
