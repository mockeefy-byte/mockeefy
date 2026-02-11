import { ReactNode } from "react";
import Navigation from "./Navigation";
import Sidebar, { SkeletonSidebar } from "./Sidebar";
import InfoPanel, { SkeletonInfoPanel } from "./InfoPanel";
import Footer from "./Footer";
import BottomNav from "./BottomNav";
import { useAuth } from "../context/AuthContext";
import { Outlet } from "react-router-dom";

interface DashboardLayoutProps {
    children?: ReactNode;
    showInfoPanel?: boolean;
}

const DashboardLayout = ({ children, showInfoPanel = false }: DashboardLayoutProps) => {
    const { user, isLoading } = useAuth();

    // Logic from Index.tsx: Show sidebar if user exists or loading
    const showSidebar = !!user?.id || isLoading;

    return (
        <div className="h-screen bg-gray-50 flex flex-col font-sans text-gray-900 overflow-hidden">
            {/* Fixed Navigation */}
            <div className="flex-none z-50">
                <Navigation />
            </div>

            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full h-[calc(100vh-80px)] overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">

                    {/* Left Sidebar - Independently Scrollable */}
                    {showSidebar && (
                        <aside className="hidden xl:col-span-3 lg:col-span-3 lg:block h-full overflow-hidden">
                            <div className="h-full overflow-y-auto no-scrollbar pb-20">
                                {isLoading ? <SkeletonSidebar /> : <Sidebar />}
                            </div>
                        </aside>
                    )}

                    {/* Main Content Area - Independently Scrollable */}
                    <section
                        className={`col-span-12 ${showSidebar
                            ? (showInfoPanel ? 'lg:col-span-6 xl:col-span-6' : 'lg:col-span-9 xl:col-span-9')
                            : 'lg:col-span-10 lg:col-start-2 xl:col-span-8 xl:col-start-3'
                            } h-full overflow-y-auto no-scrollbar pb-24`}
                    >
                        <div className="space-y-6 min-h-full">
                            {children || <Outlet />}
                        </div>

                        <div className="mt-12">
                            <Footer />
                        </div>
                    </section>

                    {/* Right InfoPanel - Independently Scrollable */}
                    {showSidebar && showInfoPanel && (
                        <aside className="hidden xl:col-span-3 lg:col-span-3 lg:block h-full overflow-hidden">
                            <div className="h-full overflow-y-auto no-scrollbar pb-20">
                                {isLoading ? <SkeletonInfoPanel /> : <InfoPanel />}
                            </div>
                        </aside>
                    )}

                </div>
            </main>

            <BottomNav />
        </div>
    );
};

export default DashboardLayout;
