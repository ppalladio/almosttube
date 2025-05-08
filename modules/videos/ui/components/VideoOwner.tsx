import Link from 'next/link';
import { VideoGetOneOutput } from '../../type';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import SubscriptionButton from '@/modules/subscriptions/ui/components/SubscriptionButton';
import UserInfo from '@/modules/users/ui/components/UserInfo';
import useSubscription from '@/modules/subscriptions/hooks/useSubscription';

interface VideoOwnerProps {
    user: VideoGetOneOutput['user'];
    videoId: string;
}
const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId, isLoaded } = useAuth();
    const { isPending, onClick } = useSubscription({
        userId: user.id,
        isSubscribed: user.viewerSubscribed,
        fromVideoId: videoId,
    });
    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar imgUrl={user.imageUrl} name={user.name} size="lg" />
                    <div className="flex flex-col gap-1 min-w-0 ">
                        <UserInfo size={'lg'} name={user.name} />
                        <span className="text-sm text-muted-foreground line-clamp-1">{user.subscriberCount} subscribers</span>
                    </div>
                </div>
            </Link>
            {userId === user.clerkId ? (
                <Button className=" rounded-full" asChild variant={'secondary'}>
                    <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
                </Button>
            ) : (
                <SubscriptionButton isSubscribed={user.viewerSubscribed} className="flex-none" onClick={onClick} disabled={isPending || !isLoaded} />
            )}
        </div>
    );
};
export default VideoOwner;
