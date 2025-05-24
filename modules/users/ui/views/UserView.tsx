import UserSection from '../sections/UserSection';
import VideosSection from '../sections/VideosSection';

interface UserViewProps {
    userId: string;
}
const UserView = ({ userId }: UserViewProps) => {
    return (
        <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto gap-y-6 mb-10">
            <UserSection userId={userId} />
            <VideosSection userId={userId} />
        </div>
    );
};
export default UserView;
