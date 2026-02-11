import Navigation from "../components/Navigation";
import Sidebar, { SkeletonSidebar } from "../components/Sidebar";
import CoachSessionCard from "../components/CoachSessionCard";
import InfoPanel, { SkeletonInfoPanel } from "../components/InfoPanel";
import Footer from "../components/Footer";
import BottomNav from "../components/BottomNav";
import { useAuth } from "../context/AuthContext";
import { ProFeatureBanner } from "../components/ProFeatureBanner";
import { EarlyAccessAd } from "../components/EarlyAccessAd";

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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 sm:px-6 lg:px-8">

          {/* Left Sidebar - Sticky */}
          {(showProfile || showSkeletons) && (
            <aside className="hidden xl:col-span-3 lg:col-span-3 lg:block space-y-6 sticky top-24 self-start">
              {showSkeletons ? <SkeletonSidebar /> : <Sidebar />}
            </aside>
          )}

          {/* Main Content (Experts) */}
          <section className={`col-span-12 ${(showProfile || showSkeletons)
            ? 'lg:col-span-6 xl:col-span-6'
            : 'lg:col-span-12'
            } space-y-6`}>

            {/* Pro Feature Banner */}
            <ProFeatureBanner />

            {/* In-Feed Ad */}
            <EarlyAccessAd />

            <CoachSessionCard />
          </section>

          {/* Right Sidebar - Sticky */}
          {(showProfile || showSkeletons) && (
            <aside className="hidden lg:col-span-3 xl:col-span-3 lg:block space-y-6 sticky top-24 self-start">
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
