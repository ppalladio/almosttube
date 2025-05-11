import { CategoriesSection } from '../section/CategoriesSection';
import VideoSection from '../section/VideoSection';

interface HomeViewProps {
    categoryId?: string;
}

export const HomeView = ({ categoryId }: HomeViewProps) => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <CategoriesSection categoryId={categoryId} />
            <VideoSection categoryId={categoryId} />
        </div>
    );
};
