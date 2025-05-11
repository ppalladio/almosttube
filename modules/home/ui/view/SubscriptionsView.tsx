import SubscriptionViewSection from '../section/SubscriptionViewSection';

export const SubscriptionView = () => {
    return (
        <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6  ">
            <div>
                <h1 className="text-xl font-bold">Subscriptions</h1>
                <p className="text-xs text-muted-foreground">Videos from your favorite creators</p>
            </div>
            <SubscriptionViewSection />
        </div>
    );
};
