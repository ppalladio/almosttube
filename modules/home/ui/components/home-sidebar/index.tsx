import { Separator } from '@/components/ui/separator';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SignedIn } from '@clerk/nextjs';
import { MainSection } from './MainSection';
import { PersonalSection } from './PersonalSection';
import { SubscriptionSection } from './SubscriptionSection';

const HomeSidebar = () => {
    return (
        <Sidebar className="pt-16 z-4 border-none" collapsible="icon">
            <SidebarContent className="bg-background">
                <MainSection />
                <Separator />
                <PersonalSection />
                <SignedIn>
                    <>
                        <Separator />
                        <SubscriptionSection />
                    </>
                </SignedIn>
            </SidebarContent>
        </Sidebar>
    );
};
export default HomeSidebar;
