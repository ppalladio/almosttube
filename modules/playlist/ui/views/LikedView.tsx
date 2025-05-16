import LikedSection from '../section/LikedSection';

export const LikedView = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <div>
                <h1 className="text-xl font-bold">Liked videos</h1>
                <p className="text-xs text-muted-foreground">Videos liked</p>
            </div>
            <LikedSection />
        </div>
    );
};
