import { trpc } from '@/trpc/client';
import { useClerk } from '@clerk/nextjs';
import { toast } from 'sonner';

interface UseSubscriptionProps {
    userId: string;
    isSubscribed: boolean;
    fromVideoId?: string;
}
const useSubscription = ({ userId, isSubscribed, fromVideoId }: UseSubscriptionProps) => {
    const clerk = useClerk();
    const utils = trpc.useUtils();

    const subscribe = trpc.subscription.create.useMutation({
        onSuccess: () => {
            toast.success('Subscribed successfully');
            utils.videos.getSubscriptions.invalidate();
            utils.users.getOne.invalidate({ id: userId });
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId });
            }
        },
        onError: (error) => {
            toast.error('Something went wrong');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });
    const unsubscribe = trpc.subscription.remove.useMutation({
        onSuccess: () => {
            toast.success('Successfully unsubscribed ');
            utils.videos.getSubscriptions.invalidate();
            utils.users.getOne.invalidate({ id: userId });
            if (fromVideoId) {
                utils.videos.getOne.invalidate({ id: fromVideoId });
            }
        },
        onError: (error) => {
            toast.error('Something went wrong');
            if (error.data?.code === 'UNAUTHORIZED') {
                clerk.openSignIn();
            }
        },
    });

    const isPending = subscribe.isPending || unsubscribe.isPending;

    const onClick = () => {
        if (isSubscribed) {
            unsubscribe.mutate({ userId });
        } else {
            subscribe.mutate({ userId });
        }
    };
    return { isPending, onClick };
};
export default useSubscription;
