import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/UserAvatar';
import SubscriptionButton from './SubscriptionButton';

interface SubscriptionItemProps {
    name: string;
    imageUrl: string;
    subscriberCount: number;
    onUnsubscribe: () => void;
    disabled: boolean;
}

export const SubscriptionItemSkeleton = () => {
    return (
        <div className="flex item-start gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="mt-1 h-3 w-20" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                </div>
            </div>
        </div>
    );
};
const SubscriptionItem = ({ name, imageUrl, subscriberCount, onUnsubscribe, disabled }: SubscriptionItemProps) => {
    return (
        <div className="flex items-center gap-4">
            <UserAvatar name={name} imgUrl={imageUrl} size="lg" />
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm">{name} </h3>
                        <p className="text-sx text-muted-foreground">{subscriberCount.toLocaleString()} subscribers</p>
                    </div>
                    <SubscriptionButton
                        size="sm"
                        onClick={(e) => {
                            e.preventDefault();
                            onUnsubscribe();
                        }}
                        disabled={disabled}
                        isSubscribed
                    />
                </div>
            </div>
        </div>
    );
};
export default SubscriptionItem;
