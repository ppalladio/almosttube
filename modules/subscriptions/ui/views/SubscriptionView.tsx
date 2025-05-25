import SubscriptionVideosSection from '../sections/SubscriptionVideoSection';

export const SubscriptionView = () => {
    return (
        <div className="max-w-[1400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <div>
                <h1 className="text-xl font-bold">All subscription</h1>
                <p className="text-xs text-muted-foreground">Users you subscribed to</p>
            </div>
            <SubscriptionVideosSection />
        </div>
    );
};
