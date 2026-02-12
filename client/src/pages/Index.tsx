import Navigation from "../components/Navigation";
import Sidebar, { SkeletonSidebar } from "../components/Sidebar";
import CoachSessionCard from "../components/CoachSessionCard";
import InfoPanel, { SkeletonInfoPanel } from "../components/InfoPanel";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { ProFeatureBanner } from "../components/ProFeatureBanner";

const Index = () => {
  const { user, isLoading } = useAuth();
  const showProfile = !!user?.id;
  const showSkeletons = isLoading; // Show skeletons while checking auth status


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50">
        <Navigation />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto py-8">
        <div className="flex flex-col lg:flex-row gap-8 px-6 sm:px-8 lg:px-10 items-start">

          {/* Left Sidebar - Sticky & Compact */}
          {(showProfile || showSkeletons) && (
            <aside className="hidden lg:block w-[260px] shrink-0 space-y-4 sticky top-20 self-start">
              {showSkeletons ? <SkeletonSidebar /> : <Sidebar />}
            </aside>
          )}

          {/* Main Content (Experts) - Flexible */}
          <section className="flex-1 min-w-0 space-y-5">

            {/* Pro Feature Banner - Compact margin */}
            <div className="mb-2">
              <ProFeatureBanner />
            </div>

            {/* Main Experts List */}
            <CoachSessionCard />
          </section>

          {/* Right Sidebar - Sticky & Compact */}
          {(showProfile || showSkeletons) && (
            <aside className="hidden xl:block w-[280px] shrink-0 space-y-4 sticky top-20 self-start">
              {showSkeletons ? <SkeletonInfoPanel /> : <InfoPanel />}
            </aside>
          )}
        </div>
      </main>

      {/* Footer - Standard Layout */}
      <Footer />

      {/* Mobile Nav - Fixed Bottom */}
      <div className="flex-shrink-0 lg:hidden relative z-50">
        <BottomNav />
      </div>
    </div>
  );
};
export default Index;
