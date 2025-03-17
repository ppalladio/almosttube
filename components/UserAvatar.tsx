import { cva, VariantProps } from 'class-variance-authority';
import { Avatar, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

const avatarVariants = cva('', {
    variants: {
        size: {
            default: 'h-9 w-9',
            xs: 'h-4 w-4',
            sm: 'h-6 w-6',
            lg: 'h-8 w-8',
            xl: 'h-12 w-12',
            xxl: 'h-[160px] w-[160px]',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
    imgUrl: string;
    name: string;
    className?: string;
    onClick?: () => void;
}
const UserAvatar = ({ imgUrl, name, className, onClick, size }: UserAvatarProps) => {
    return (
        <Avatar className={cn(avatarVariants({ size, className }))} onClick={onClick}>
            <AvatarImage src={imgUrl} alt={name} />
        </Avatar>
    );
};
export default UserAvatar;
