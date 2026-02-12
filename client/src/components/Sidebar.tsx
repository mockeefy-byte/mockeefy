import { useState, useEffect } from "react";
import {
  Edit3,
  User,
  Calendar,
  Video,
  Briefcase
} from "lucide-react";
import axios from '../lib/axios';
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getProfileImageUrl } from "../lib/imageUtils";
import { useUserProfile } from "../hooks/useUserProfile";
import { ProUpgradeCard } from "./ProUpgradeCard";

const Sidebar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: userProfile, isLoading: isProfileLoading } = useUserProfile();
  // const { data: certData } = useCertification();

  // Mock Next Session Data (or fetch real)
  const [nextSession, setNextSession] = useState<any>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      if (user?.id) {
        try {
          const sessionsRes = await axios.get(`/api/sessions/candidate/${user.id}`);
          if (Array.isArray(sessionsRes.data)) {
            const now = new Date();
            const upcoming = sessionsRes.data
              .filter((s: any) => new Date(s.startTime) > now && s.status !== 'Cancelled')
              .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
            if (upcoming) setNextSession(upcoming);
          }
        } catch (error) {
          console.error("Error fetching sessions:", error);
        }
      }
    };
    fetchSessions();
  }, [user?.id]);

  const displayProfile = userProfile?.data || {
    name: user?.name || "User",
    profileImage: null,
    experience: [],
    profileCompletion: 65, // Mock default
    email: user?.email || "",
    personalInfo: { city: "Online" }
  };

  const NavItem = ({ icon: Icon, label, path, active }: any) => (
    <button
      onClick={() => navigate(path)}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 group ${active
        ? "bg-blue-50 text-[#004fcb]"
        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      <Icon size={16} className={`transition-colors ${active ? "text-[#004fcb]" : "text-gray-400 group-hover:text-gray-600"}`} />
      {label}
    </button>
  );

  // Completion Ring Helper
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((displayProfile.profileCompletion || 0) / 100) * circumference;

  if (!displayProfile && isProfileLoading) return <SkeletonSidebar />;

  return (
    <div className="w-full max-w-[260px] mx-auto space-y-4">

      {/* 1. Compact Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md">
        <div className="flex items-start gap-3 mb-3">
          <div className="relative shrink-0">
            {/* Ring Wrapper */}
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="22" cy="22" r={radius}
                  fill="none"
                  stroke="#004fcb"
                  strokeWidth="3"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                />
              </svg>
              <img
                src={getProfileImageUrl(displayProfile.profileImage)}
                alt={displayProfile.name}
                className="w-9 h-9 rounded-full object-cover border border-white shadow-sm absolute"
                onError={(e) => { e.currentTarget.src = getProfileImageUrl(null); }}
              />
            </div>
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <h3 className="font-bold text-gray-900 text-sm truncate leading-tight">{displayProfile.name}</h3>
            <p className="text-[10px] text-gray-500 font-medium truncate uppercase tracking-wide mt-0.5">
              {displayProfile.experience?.[0]?.position || "Candidate"}
            </p>
            <p className="text-[10px] text-[#004fcb] font-bold mt-1">
              {displayProfile.profileCompletion || 0}% Complete
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate("/profile")}
          className="w-full flex items-center justify-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-1.5 rounded-lg text-xs font-bold transition-all border border-gray-100"
        >
          <Edit3 size={12} />
          Edit Profile
        </button>
      </div>

      {/* 2. Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
        <div className="space-y-0.5">
          <NavItem
            icon={User}
            label="Profile"
            path="/profile"
            active={location.pathname === "/profile"}
          />
          <NavItem
            icon={Calendar}
            label="My Sessions"
            path="/my-sessions"
            active={location.pathname === "/my-sessions" && !location.search.includes('view=jobs')}
          />
          <NavItem
            icon={Briefcase}
            label="Job Portal"
            path="/my-sessions?view=jobs"
            active={location.pathname === "/my-sessions" && location.search.includes('view=jobs')}
          />
        </div>
      </div>

      {/* 2.5 Pro Upgrade Ad */}
      <ProUpgradeCard />

      {/* 3. Upcoming Session (Compact) */}
      {nextSession && (
        <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Up Next</span>
            </div>
            <span className="text-[10px] font-bold text-gray-900">
              {new Date(nextSession.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <img
              src={getProfileImageUrl(nextSession.expertDetails?.profileImage)}
              className="w-8 h-8 rounded-lg object-cover bg-gray-50 border border-gray-100"
              alt="Expert"
            />
            <div className="min-w-0">
              <p className="font-bold text-xs text-gray-900 truncate">{nextSession.expertDetails?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">Mock Interview</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/my-sessions')}
            className="w-full flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-black text-white py-1.5 rounded-lg text-[10px] font-bold transition-colors"
          >
            <Video size={10} />
            Join Now
          </button>
        </div>
      )}

    </div>
  );
};

export const SkeletonSidebar = () => (
  <div className="w-full max-w-xs mx-auto space-y-6 pb-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-24 animate-pulse p-4 flex gap-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
    <div className="w-full h-20 bg-gray-200 rounded-xl animate-pulse"></div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 space-y-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-11 w-full bg-gray-50 rounded-xl animate-pulse" />
      ))}
    </div>
  </div>
);

export default Sidebar;