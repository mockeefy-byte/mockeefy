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
    sidebar?: ReactNode;
}

const DashboardLayout = ({ children, showInfoPanel = false, sidebar }: DashboardLayoutProps) => {
    const { user, isLoading } = useAuth();
    const showSidebar = !!user?.id || isLoading;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
            {/* Sticky Navigation Top Bar */}
            <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
                <Navigation />
            </div>

            {/* Main Layout Area - Edge to Edge */}
            <div className="flex flex-1 w-full relative">

                {/* Left Sidebar - Fixed Width, Full Height */}
                {showSidebar && (
                    <aside className="w-[280px] hidden lg:block border-r border-gray-200 bg-white shrink-0 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide self-start">
                        {isLoading ? <SkeletonSidebar /> : (sidebar || <Sidebar />)}
                    </aside>
                )}

                {/* Main Content Area - Fills remaining width, scrolls independently */}
                <main className="flex-1 bg-gray-50 relative flex flex-col">
                    <div className="flex-1 p-8 md:p-10 w-full max-w-[1920px] mx-auto">
                        {children || <Outlet />}
                    </div>

                    <div className="mt-auto border-t border-gray-200 bg-white">
                        <Footer />
                    </div>
                </main>

                {/* Right InfoPanel - Fixed Width (if needed) */}
                {showSidebar && showInfoPanel && (
                    <aside className="w-[300px] hidden xl:block border-l border-gray-200 bg-white shrink-0 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto self-start">
                        {isLoading ? <SkeletonInfoPanel /> : <InfoPanel />}
                    </aside>
                )}

            </div>

            <BottomNav />
        </div>
    );
};

export default DashboardLayout;
