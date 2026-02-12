import { Shield, BookOpen, Lightbulb, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { JobReferralCard } from "./JobReferralCard";

const mockStatus = [
  "Actively booking mocks",
  "Preparing for mock sessions",
  "Scheduled for a mock",
  "Received mock feedback",
  "Just exploring mock interviews",
  "Not interested in mocks"
];

const InfoPanel = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      {/* 0. Right Side Ad - AI Resume Analysis */}
      <div
        onClick={() => navigate('/ai-video')}
        className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-4 text-white shadow-md relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.02]"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
            <Sparkles size={10} className="text-yellow-300" /> AI Powered
          </span>
          <h3 className="font-bold text-sm mb-1">AI Resume Analysis</h3>
          <p className="text-[11px] text-purple-100 mb-3 opacity-90 line-clamp-2">
            Get instant AI feedback to optimize your resume for top tech companies.
          </p>
          <div className="flex items-center gap-2 text-[10px] font-medium opacity-80 mb-3">
            <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div> Available 24/7</span>
          </div>
          <button className="w-full bg-white text-indigo-700 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-purple-50 transition-colors">
            Start Analysis
          </button>
        </div>
      </div>

      {/* Mock Journey Card - Compact */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
            Your Journey
          </span>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-3 leading-tight">
          Current Status
        </h3>
        <div className="space-y-1.5">
          {mockStatus.slice(0, 4).map((status, index) => (
            <button
              key={index}
              className="w-full py-2 px-3 text-[11px] font-semibold border border-gray-100 hover:border-blue-100 rounded-lg bg-gray-50 hover:bg-blue-50/50 text-gray-600 hover:text-blue-700 transition-all text-left flex items-center gap-2"
            >
              <div className={`w-1 h-1 rounded-full ${index === 0 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Safety */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 hover:border-blue-200 transition-colors cursor-pointer group">
          <Shield className="w-4 h-4 text-gray-400 group-hover:text-blue-600 mb-2" />
          <p className="text-xs font-bold text-gray-900">Safe & Secure</p>
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">All sessions are private</p>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl border border-gray-200 p-3 hover:border-blue-200 transition-colors cursor-pointer group">
          <Lightbulb className="w-4 h-4 text-gray-400 group-hover:text-amber-500 mb-2" />
          <p className="text-xs font-bold text-gray-900">Interview Tip</p>
          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Use STAR method</p>
        </div>
      </div>

      {/* Resources - Compact List */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-900">Preparation</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <a href="#" className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
            <span className="text-xs font-bold text-gray-700">Questions</span>
          </a>
          <a href="#" className="flex flex-col items-center justify-center py-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all">
            <span className="text-xs font-bold text-gray-700">Guides</span>
          </a>
        </div>
      </div>

    </div>
  );
};

export const SkeletonInfoPanel = () => (
  <div className="space-y-4 animate-pulse">
    {/* Mock Journey Card Skeleton */}
    <div className="rounded-xl border border-gray-200 bg-white h-64 p-5 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-8 bg-gray-100 rounded w-full"></div>
        ))}
      </div>
    </div>

    {/* Safety Card Skeleton */}
    <div className="rounded-xl border border-gray-200 bg-white h-24 p-5 flex gap-4">
      <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

export default InfoPanel;
