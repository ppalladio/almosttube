import Link from 'next/link';
import { VideoGetOneOutput } from '../../type';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import SubscriptionButton from '@/modules/subscriptions/ui/components/SubscriptionButton';
import UserInfo from '@/modules/users/ui/components/UserInfo';

interface VideoOwnerProps {
    user: VideoGetOneOutput['user'];
    videoId: string;
}
const VideoOwner = ({ user, videoId }: VideoOwnerProps) => {
    const { userId } = useAuth();
    return (
        <div className="flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0">
            <Link href={`/users/${user.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                    <UserAvatar imgUrl={user.imageUrl} name={user.name} size="lg" />
                    <div className="flex flex-col gap-1 min-w-0 ">
                        <UserInfo size={'lg'} name={user.name} />
                        <span className="text-sm text-muted-foreground line-clamp-1">
                            {/* todo get number of subscribers */}
                            subscribers
                        </span>
                    </div>
                </div>
            </Link>
            {userId === user.clerkId ? (
                <Button className=" rounded-full" asChild variant={'secondary'}>
                    <Link href={`/studio/videos/${videoId}`}>Edit Video</Link>
                </Button>
            ) : (
                <SubscriptionButton isSubscribed={false} className="flex-none" onClick={() => {}} disabled={false} />
            )}
        </div>
    );
};
export default VideoOwner;
