import TrendingVideosSection from '../section/TrendingVideosSection';

export const TrendingView = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <div>
                <h1 className="text-xl font-bold">Trending Videos</h1>
                <p className="text-xs text-muted-foreground">Most popular videos</p>
            </div>
            <TrendingVideosSection />
        </div>
    );
};
