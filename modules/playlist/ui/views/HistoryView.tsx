import HistoryVideosSection from '../section/HistoryVideoSection';

export const HistoryView = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <div>
                <h1 className="text-xl font-bold">History</h1>
                <p className="text-xs text-muted-foreground">Videos view history</p>
            </div>
            <HistoryVideosSection />
        </div>
    );
};
