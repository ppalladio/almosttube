interface HomeLayoutProps {
    children: React.ReactNode;
}
export const HomeLayout = ({ children }: HomeLayoutProps) => {
    return (
        <div>
            <div className="bg-blue-600">home navbar</div>
            {children}
        </div>
    );
};
