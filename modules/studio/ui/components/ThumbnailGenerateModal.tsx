import ResponsiveModal from '@/components/ResponsiveModal';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/trpc/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ThumbnailGenerateModalProps {
    videoId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
    prompt: z.string().min(10),
});
const ThumbnailGenerateModal = ({ videoId, open, onOpenChange }: ThumbnailGenerateModalProps) => {
    const generateThumbnail = trpc.videos.generateThumbnail.useMutation({
        onSuccess: () => {
            toast.success('Background job started', {
                description: 'This might take some time',
            });
            form.reset();
            onOpenChange(false);
        },
        onError: () => {
            toast.error('Something went wrong');
        },
    });
    const onSubmit = (values: z.infer<typeof formSchema>) => {
        generateThumbnail.mutate({ id: videoId, prompt: values.prompt });
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
        },
    });
    return (
        <ResponsiveModal title="Upload a thumbnail" open={open} onOpenChange={onOpenChange}>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="prompt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Prompt</FormLabel>
                                <FormControl>
                                    <Textarea {...field} className="resize-none" cols={30} rows={5} placeholder="Enter a prompt for thumbnail..." />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end">
                        <Button disabled={generateThumbnail.isPending} type="submit">
                            Generate
                        </Button>
                    </div>
                </form>
            </Form>
        </ResponsiveModal>
    );
};
export default ThumbnailGenerateModal;
