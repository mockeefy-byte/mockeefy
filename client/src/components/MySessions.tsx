import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Video,
  Download,
  FileText,
  User,
  TrendingUp,
  Award,
  Briefcase,
  ChevronRight,
  LayoutDashboard,
  ListVideo,
  PieChart,
  Star,
  RefreshCw,
  Play,
  Calendar,
  Bookmark,
  MapPin,
  CheckCircle,
  Zap,
  DollarSign, // New Import
  Shield as ShieldIcon // Rename to avoid conflict if needed, or just use Shield
} from "lucide-react";
import { toast } from "sonner";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useAuth } from "../context/AuthContext";
import axios from '../lib/axios';
import { getProfileImageUrl } from "../lib/imageUtils";

// --- Types ---

type Session = {
  id: string;
  expert: string;
  role: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  status: "Upcoming" | "Completed" | "Cancelled" | "Confirmed" | "Live";
  score?: number; // Mock score for completed sessions
  meetLink?: string;
  sessionId: string;
  expertId?: string;
  profileImage?: string | null;
  startTime?: string;
  endTime?: string;
  category?: string;
};

type SavedExpert = {
  id: string;
  expertID: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  rating: number;
  reviews: number;
  price: string;
  location: string;
  skills: string[];
  experience: string;
  responseTime: string;
  totalAvailableSlots: number;
  isVerified: boolean;
};

// --- Mock Data ---



// --- Components ---

function StatCard({ label, value, icon, color, loading }: { label: string, value: number, icon: any, color: string, loading?: boolean }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{label}</p>
        {loading ? (
          <div className="h-8 w-12 bg-gray-100 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${color}`}>
        {icon}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Upcoming: "bg-purple-50 text-purple-700 border-purple-100",
    Confirmed: "bg-blue-50 text-blue-700 border-blue-100",
    Completed: "bg-gray-100 text-gray-600 border-gray-200",
    Cancelled: "bg-red-50 text-red-700 border-red-100",
    Live: "bg-blue-100 text-blue-700 border-blue-200"
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider border ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

// Mobile Session Card Component
function SessionCard({ session, handleJoin }: { session: Session, handleJoin: (s: Session) => void }) {
  const isJoinable = ['Confirmed', 'Live', 'Upcoming', 'confirmed', 'live', 'upcoming'].includes(session.status);

  return (
    <div className={`p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0 ${isJoinable ? 'bg-blue-50/30' : ''}`}>
      <div className="flex items-start gap-4">
        {/* Expert Avatar */}
        <img
          src={getProfileImageUrl(session.profileImage)}
          className="w-12 h-12 rounded-xl object-cover bg-gray-200 flex-shrink-0"
          alt={session.expert}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">{session.category} Interview</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {new Date(session.startTime || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {session.time}
              </p>
            </div>
            <StatusBadge status={isJoinable ? 'Live' : session.status} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-700">{session.expert}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-full">
              {session.status === 'Completed' ? (
                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                  View Report
                </button>
              ) : (
                <button
                  onClick={() => handleJoin(session)}
                  disabled={!isJoinable && session.status !== 'Upcoming'}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold rounded-lg transition-all
                     ${isJoinable
                      ? 'bg-[#004fcb] text-white hover:bg-blue-700 shadow-md'
                      : 'bg-gray-100 text-gray-400'}`}
                >
                  {isJoinable ? 'JOIN INTERVIEW' : 'View Details'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionsList({ sessions, handleJoin, loading }: { sessions: Session[], handleJoin: (s: Session) => void, loading: boolean }) {
  if (loading) {
    return (
      <div className="p-8">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-100 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) return (
    <div className="p-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Video className="w-8 h-8 text-gray-300" />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">No sessions found</h3>
      <p className="text-gray-500 mb-6">You haven't booked any interview sessions yet.</p>
      <button
        onClick={() => window.location.href = '/dashboard'}
        className="bg-[#004fcb] text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all inline-flex items-center gap-2"
      >
        <Briefcase className="w-4 h-4" />
        Book Your First Interview
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Card View */}
      <div className="block md:hidden">
        <div className="divide-y divide-gray-100">
          {sessions.map((session) => (
            <SessionCard key={session.id} session={session} handleJoin={handleJoin} />
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400 font-bold">
              <th className="px-6 py-4">Session Details</th>
              <th className="px-6 py-4">Interviewer</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sessions.map((session) => {
              // Check status directly. Defer time validation to the Lobby page for better UX.
              const isJoinable = ['Confirmed', 'Live', 'Upcoming', 'confirmed', 'live', 'upcoming'].includes(session.status);

              return (
                <tr key={session.id} className={`hover:bg-blue-50/50 transition-colors group ${isJoinable ? 'bg-blue-50/30' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-sm">{session.category} Interview</span>
                      <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <Calendar className="w-3 h-3" />
                        {/* Explicit Date Format */}
                        {new Date(session.startTime || '').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        <span className="text-gray-300">|</span>
                        {session.time}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={getProfileImageUrl(session.profileImage)}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-200"
                        alt={session.expert}
                      />
                      <div>
                        <p className="text-sm font-bold text-gray-900">{session.expert}</p>
                        <p className="text-xs text-gray-500">{session.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={isJoinable ? 'Live' : session.status} />
                    {session.score && (
                      <div className="mt-1 text-xs font-bold text-gray-900">
                        Score: <span className="text-[#004fcb]">{session.score}/100</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-100">
                      {session.status === 'Completed' ? (
                        <>
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg tooltip" title="View Report">
                            <FileText className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleJoin(session)}
                          disabled={!isJoinable && session.status !== 'Upcoming'}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2 ml-auto
                          ${isJoinable
                              ? 'bg-[#004fcb] text-white hover:bg-blue-700 shadow-md shadow-blue-600/20'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        >
                          {isJoinable ? <><Play className="w-3 h-3" /> JOIN NOW</> : 'View Details'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SkillBar({ label, score, color }: { label: string, score: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-bold text-gray-700">{label}</span>
        <span className="text-xs font-bold text-gray-900">{score}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
}

function SavedExpertCard({ expert, onRefresh }: { expert: SavedExpert, onRefresh: () => void }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUnsave = async (e: any) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await axios.delete(`/api/user/saved-experts/${expert.expertID}`);
      toast.success("Removed from saved list");
      onRefresh();
    } catch (error) {
      toast.error("Failed to remove");
    } finally {
      setLoading(false);
    }
  };

  const handleBook = () => {
    navigate(`/book-session`, {
      state: {
        profile: { ...expert, id: expert.expertID }, // Adapter for profile
        expertId: expert.expertID
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-[#004fcb] transition-all shadow-sm group">
      <div className="flex items-start gap-3 mb-3">
        <img
          src={expert.avatar}
          alt={expert.name}
          className="w-12 h-12 rounded-lg object-cover bg-gray-100"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 truncate">{expert.name}</h3>
          <p className="text-xs text-gray-500 truncate">{expert.role} @ {expert.company}</p>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" />
            {expert.location}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded-lg">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-yellow-500 fill-current" />
          <span className="font-bold text-gray-900">{expert.rating.toFixed(1)}</span>
          <span>({expert.reviews})</span>
        </div>
        <div className="w-px h-3 bg-gray-300"></div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-amber-500" />
          <span>{expert.responseTime}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleUnsave}
          disabled={loading}
          className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-colors text-green-600 bg-green-50 border-green-200"
          title="Saved (Click to remove)"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
        </button>
        <button
          onClick={handleBook}
          className="flex-1 bg-[#004fcb] hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition-colors"
        >
          Book Session
        </button>
      </div>
    </div>
  );
}

// --- Component ---

const MySessions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialView = (searchParams.get('view') as any) || 'overview';

  const [activeView, setActiveView] = useState<'overview' | 'sessions' | 'certifications' | 'reports' | 'saved' | 'jobs'>(initialView);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  // Sync state with URL
  useEffect(() => {
    const view = new URLSearchParams(location.search).get('view');
    if (view && ['overview', 'sessions', 'certifications', 'reports', 'saved', 'jobs'].includes(view)) {
      setActiveView(view as any);
      window.scrollTo(0, 0);
    }
  }, [location.search]);

  // Saved Experts State
  const [savedExperts, setSavedExperts] = useState<SavedExpert[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  // Jobs State
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null); // New state for details view
  const [jobsLoading, setJobsLoading] = useState(false);

  // Fetch Jobs
  const fetchJobs = async () => {
    setJobsLoading(true);
    try {
      const res = await axios.get("/api/jobs");
      setJobs(res.data.data || []);
    } catch (e) {
      console.error("Failed to fetch jobs", e);
    } finally {
      setJobsLoading(false);
    }
  };

  // Fetch Saved Experts
  const fetchSavedExperts = async () => {
    if (!user?.id) return;
    setSavedLoading(true);
    try {
      const res = await axios.get("/api/user/saved-experts");
      if (res.data?.data) {
        const mapped = res.data.data.map((item: any) => {
          const expert = item.expertId;
          if (!expert) return null;
          let exp = "";
          if (expert.professionalDetails?.totalExperience) exp = expert.professionalDetails.totalExperience === 1 ? "1 year" : `${expert.professionalDetails.totalExperience} years`;
          // Fallback for experience (simplified for this view)
          else exp = "Experienced";

          return {
            id: expert._id || expert.userId,
            expertID: expert._id,
            name: expert.personalInformation?.userName || "Expert",
            role: expert.professionalDetails?.title || `Expert`,
            company: expert.professionalDetails?.company || "Freelance",
            avatar: getProfileImageUrl(expert.profileImage),
            rating: expert.metrics?.avgRating || 0,
            reviews: expert.metrics?.totalReviews || 0,
            price: expert.price ? `₹${expert.price}` : "₹500",
            location: expert.personalInformation?.city || "Online",
            skills: ((expert.expertSkills || []).map((s: any) => s.skillName).slice(0, 3)) || [],
            experience: exp,
            responseTime: expert.metrics?.avgResponseTime ? `${Math.round(expert.metrics.avgResponseTime)}h` : "fast",
            totalAvailableSlots: 5, // Mock or calc
            isVerified: expert.status === "Active"
          };
        }).filter(Boolean);
        setSavedExperts(mapped);
      }
    } catch (e) {
      console.error("Failed to fetch saved experts", e);
    } finally {
      setSavedLoading(false);
    }
  };

  // Certification State
  const [certData, setCertData] = useState<{
    completedSessions: number;
    targetSessions: number;
    isEligibleForCertificate: boolean;
    certifications: any[];
    nextMilestone: string;
  } | null>(null);

  // Fetch Certification Status
  const fetchCertStatus = async () => {
    if (!user?.id && !user?._id) return;
    try {
      const userId = (user as any)._id || user.id;
      const res = await axios.get(`/api/certifications/status/${userId}`);
      if (res.data.success) {
        setCertData(res.data.data);
      }
    } catch (e) {
      console.error("Failed to fetch cert status", e);
    }
  };

  useEffect(() => {
    fetchCertStatus();
  }, [user]);

  const handleClaimCertificate = async () => {
    if (!user?.id && !user?._id) return;
    try {
      const userId = (user as any)._id || user.id;
      const res = await axios.post('/api/certifications/issue', { userId });
      if (res.data.success) {
        toast.success("Certificate Issued Successfully!");
        fetchCertStatus(); // Refresh
      }
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Failed to issue certificate");
    }
  };

  // --- Restored Logic ---

  const fetchSessions = async (isRefresh = false) => {
    if (!user?._id && !user?.id) return;

    // Only show full page loader if we don't have data and it's not a background refresh
    if (sessions.length === 0 && !isRefresh) {
      setLoading(true);
    }

    try {
      const userId = (user as any)._id || user.id;
      // Defaulting role to 'candidate' if not present, user.role should be available but fallback is safe
      const role = (user as any).role || 'candidate';
      const res = await axios.get(`/api/sessions/user/${userId}/role/${role}`);

      if (res.data) {
        // Handle array response directly (as seen in sessionController.getUserSessions)
        const rawSessions = Array.isArray(res.data) ? res.data : (res.data.data || []);

        // Map backend data to frontend model
        const mappedSessions = rawSessions.map((s: any) => ({
          id: s._id || s.sessionId,
          sessionId: s.sessionId,
          expertId: s.expertId,
          // Extract from expertDetails or fallback
          expert: s.expertDetails?.name || s.expertName || 'Unknown Expert',
          role: s.expertDetails?.role || 'Expert',
          company: s.expertDetails?.company || '',
          profileImage: s.expertDetails?.profileImage || null,
          category: s.category || (s.expertDetails?.category || 'General'),

          date: new Date(s.startTime).toLocaleDateString(),
          time: new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          startTime: s.startTime,
          endTime: s.endTime,
          duration: s.duration ? `${s.duration} min` : '30 min',
          status: s.status.charAt(0).toUpperCase() + s.status.slice(1), // Capitalize first letter
          score: s.expertReview?.overallRating ? (s.expertReview.overallRating * 20) : undefined, // Scale 5 -> 100
          meetLink: s.meetingLink
        }));
        setSessions(mappedSessions);
      }
    } catch (e) {
      console.error("Failed to fetch sessions", e);
      // toast.error("Failed to load sessions"); // Optional
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchSessions();
    }
  }, [user]);

  // Ensure experts/jobs are fetched if traversing to Saved/Jobs view
  useEffect(() => {
    if (activeView === 'saved') {
      fetchSavedExperts();
    } else if (activeView === 'jobs') {
      fetchJobs();
    }
  }, [activeView]);

  const handleJoin = (session: Session) => {
    const role = (user as any).role || 'candidate';
    navigate(`/live-meeting/${session.sessionId}`, {
      state: {
        role,
        session
      }
    });
  };

  // Sidebar Menu Items
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Board', icon: Briefcase }, // New
    { id: 'sessions', label: 'All Sessions', icon: ListVideo },
    { id: 'certifications', label: 'Certifications', icon: Award },
    { id: 'reports', label: 'Reports', icon: PieChart },
    { id: 'saved', label: 'Saved Experts', icon: Bookmark },
  ];

  const SidebarContent = (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-24 self-start">

      {/* User Mini Profile */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="flex items-center gap-3 mb-1">
          <img
            src={getProfileImageUrl(user?.profileImage)}
            alt="User"
            className="w-12 h-12 rounded-xl object-cover bg-white shadow-sm border border-gray-200"
          />
          <div className="overflow-hidden">
            <p className="font-bold text-gray-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 truncate capitalize">{(user as any)?.role || 'Candidate'}</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeView === item.id
              ? 'bg-[#004fcb] text-white shadow-md shadow-blue-500/20'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-white' : 'text-gray-400'}`} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Support / Help */}
      <div className="p-4 border-t border-gray-100 mt-2">
        <button className="w-full flex items-center gap-3 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors">
          <ShieldIcon className="w-4 h-4" />
          Help & Support
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      {/* Sticky Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <Navigation />
      </div>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">

        {/* Desktop Sidebar: Sticky */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          {SidebarContent}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-6 overflow-x-auto no-scrollbar pb-2">
            <div className="flex items-center gap-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${activeView === item.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-600 border-gray-200'
                    }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Page Header REMOVED - Logic moved inside each view */}

          <div className="min-h-[500px]">
            {/* VIEW: OVERVIEW */}
            {activeView === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Overview Wrapper - Card Style */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-8">

                  {/* Section Title inside the card */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Dashboard Overview</h2>
                      <p className="text-sm text-gray-500">Track your progress towards your job referral certificate.</p>
                    </div>
                    <button
                      onClick={() => { setRefreshing(true); fetchSessions(true); }}
                      className="p-2 text-gray-400 hover:text-[#004fcb] hover:bg-blue-50 rounded-lg transition-all"
                      title="Refresh Dashboard"
                    >
                      <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    <StatCard
                      label="Total Sessions"
                      value={sessions.length}
                      icon={<LayoutDashboard className="w-6 h-6 text-blue-600" />}
                      color="bg-blue-50"
                      loading={loading}
                    />
                    <StatCard
                      label="Completed"
                      value={sessions.filter(s => s.status === 'Completed').length}
                      icon={<CheckCircle className="w-6 h-6 text-emerald-600" />}
                      color="bg-emerald-50"
                      loading={loading}
                    />
                    <StatCard
                      label="Upcoming"
                      value={sessions.filter(s => ['Upcoming', 'Confirmed'].includes(s.status)).length}
                      icon={<Calendar className="w-6 h-6 text-purple-600" />}
                      color="bg-purple-50"
                      loading={loading}
                    />
                    <StatCard
                      label="Certificates"
                      value={certData?.certifications?.length || 0}
                      icon={<Award className="w-6 h-6 text-amber-600" />}
                      color="bg-amber-50"
                      loading={loading}
                    />
                  </div>

                  {/* Job Referral Process Steps */}
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                      Job Referral Process
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                      {/* Connecting Line (Desktop) */}
                      <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2 scale-x-75 transform origin-center"></div>

                      <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative z-10">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm border-4 border-white">1</div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Complete 3 Mocks</p>
                          <p className="text-xs text-gray-500 mt-1">Book and finish 3 mock interviews with experts.</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative z-10">
                        <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-sm border-4 border-white">2</div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Get Certified</p>
                          <p className="text-xs text-gray-500 mt-1">Receive your verified certificate automatically.</p>
                        </div>
                      </div>

                      <div className="flex flex-col items-center text-center space-y-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm relative z-10">
                        <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm border-4 border-white">3</div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">Unlock Referrals</p>
                          <p className="text-xs text-gray-500 mt-1">Access the portal and get referred to top companies.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Up Next Section */}
                  <div className="border-t border-gray-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Play className="w-5 h-5 text-blue-600" />
                        Up Next
                      </h2>
                      <button onClick={() => setActiveView('sessions')} className="text-sm font-bold text-[#004fcb] hover:underline">
                        View All
                      </button>
                    </div>

                    {loading ? (
                      <div className="animate-pulse space-y-4">
                        <div className="bg-gray-100 h-24 rounded-xl w-full"></div>
                      </div>
                    ) : sessions.filter(s => ['Upcoming', 'Confirmed', 'Live'].includes(s.status)).length > 0 ? (
                      <SessionsList
                        sessions={sessions.filter(s => ['Upcoming', 'Confirmed', 'Live'].includes(s.status)).slice(0, 1)}
                        handleJoin={handleJoin}
                        loading={loading}
                      />
                    ) : (
                      <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <p className="text-gray-500 text-sm mb-2">No upcoming interviews scheduled.</p>
                        <button onClick={() => navigate('/')} className="text-[#004fcb] font-bold text-xs hover:underline">
                          Find an expert
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: JOBS */}
            {/* VIEW: JOBS */}
            {activeView === 'jobs' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Job Board Header - Hide when showing details to keep it clean, or keep it? Keeping it for context but chaging text if details */}
                {!selectedJob ? (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Briefcase className="w-6 h-6 text-[#004fcb]" />
                          Job Board
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Curated opportunities from top companies.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => { setRefreshing(true); fetchJobs(); }}
                          className="p-2 text-gray-400 hover:text-[#004fcb] hover:bg-blue-50 rounded-lg transition-all"
                          title="Refresh Jobs"
                        >
                          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {jobsLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse"></div>
                        ))}
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                          <Briefcase className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">No jobs posted yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto mt-2">Check back later for new opportunities.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4">
                        {jobs.map((job) => (
                          <div key={job._id} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-md transition-all group">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#004fcb] transition-colors">{job.position}</h3>
                                    <p className="text-gray-500 font-medium">{job.company}</p>
                                  </div>
                                  <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-semibold uppercase tracking-wide">
                                    {job.type}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    {job.location}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <DollarSign className="w-4 h-4 text-gray-400" />
                                    {job.salary}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    Posted {new Date(job.postedAt).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 mt-4 md:mt-0 md:self-center">
                                <button
                                  onClick={() => setSelectedJob(job)}
                                  className="px-5 py-2.5 bg-white text-gray-900 border border-gray-200 hover:border-[#004fcb] hover:text-[#004fcb] rounded-lg font-bold text-sm transition-all shadow-sm"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  /* JOB DETAILS VIEW */
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
                    {/* Header / Back Button */}
                    <div className="p-4 border-b border-gray-100 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedJob(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" /> {/* Reusing Chevron as Back Arrow */}
                      </button>
                      <span className="font-bold text-gray-700">Back to Jobs</span>
                    </div>

                    <div className="p-8">
                      {/* Header Info */}
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 border-b border-gray-100 pb-8">
                        <div>
                          <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedJob.position}</h1>
                          <div className="flex items-center gap-3 text-lg text-gray-600 mb-4">
                            <span className="font-semibold text-[#004fcb]">{selectedJob.company}</span>
                            <span>•</span>
                            <span>{selectedJob.location}</span>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">{selectedJob.type}</span>
                            <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-semibold">{selectedJob.salary}</span>
                            {selectedJob.experienceLevel && <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-semibold">{selectedJob.experienceLevel}</span>}
                          </div>
                        </div>
                        <a
                          href={selectedJob.applyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-8 py-3 bg-[#004fcb] text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all transform hover:-translate-y-1 block text-center"
                        >
                          Apply Now
                        </a>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-8">
                          <section>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">About the Role</h3>
                            <div className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                              {selectedJob.description}
                            </div>
                          </section>

                          {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                            <section>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">Requirements</h3>
                              <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {selectedJob.requirements.map((req: string, i: number) => (
                                  <li key={i}>{req}</li>
                                ))}
                              </ul>
                            </section>
                          )}

                          {selectedJob.benefits && selectedJob.benefits.length > 0 && (
                            <section>
                              <h3 className="text-xl font-bold text-gray-900 mb-4">Benefits</h3>
                              <ul className="list-disc list-inside space-y-2 text-gray-600">
                                {selectedJob.benefits.map((ben: string, i: number) => (
                                  <li key={i}>{ben}</li>
                                ))}
                              </ul>
                            </section>
                          )}
                        </div>

                        {/* Sidebar / Process */}
                        <div className="lg:col-span-1">
                          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 sticky top-24">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Hiring Process</h3>

                            {selectedJob.process && selectedJob.process.length > 0 ? (
                              <div className="space-y-6 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200"></div>

                                {selectedJob.process.map((step: any, index: number) => (
                                  <div key={index} className="relative flex gap-4">
                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-[#004fcb] text-[#004fcb] font-bold text-sm flex items-center justify-center shrink-0 z-10">
                                      {index + 1}
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-gray-900 text-sm">{step.title}</h4>
                                      <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500 italic">No specific process details provided.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW: SESSIONS */}
            {activeView === 'sessions' && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-fadeIn">
                <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Internal Header for Sessions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between w-full gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">All Sessions</h2>
                      <p className="text-sm text-gray-500">Manage and join your scheduled interviews.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg">
                        {['all', 'upcoming', 'completed'].map(f => (
                          <button
                            key={f}
                            onClick={() => setStatusFilter(f)}
                            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-md border transition-all ${statusFilter === f
                              ? 'bg-white text-gray-900 border-gray-200 shadow-sm'
                              : 'bg-transparent text-gray-500 border-transparent hover:text-gray-700'
                              }`}
                          >
                            {f}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={() => { setRefreshing(true); fetchSessions(); }}
                        className="p-2 text-gray-400 hover:text-[#004fcb] hover:bg-blue-50 rounded-lg transition-all"
                        title="Refresh Sessions"
                      >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>
                  </div>
                </div>
                <SessionsList
                  sessions={sessions.filter(s => {
                    if (statusFilter === 'all') return true;
                    if (statusFilter === 'upcoming') return ['Upcoming', 'Confirmed', 'Live'].includes(s.status);
                    if (statusFilter === 'completed') return s.status === 'Completed';
                    return true;
                  })}
                  handleJoin={handleJoin}
                  loading={loading}
                />
              </div>
            )}

            {/* VIEW: CERTIFICATIONS */}
            {
              activeView === 'certifications' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Award className="w-6 h-6 text-purple-600" />
                          Earned Certifications
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Track your earned credentials.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {certData && (
                          <div className="bg-purple-50 px-4 py-2 rounded-xl text-xs font-semibold text-purple-700 border border-purple-100">
                            Next: {certData.nextMilestone}
                          </div>
                        )}
                        <button
                          onClick={() => { setRefreshing(true); fetchSessions(); }}
                          className="p-2 text-gray-400 hover:text-[#004fcb] hover:bg-blue-50 rounded-lg transition-all"
                          title="Refresh Certifications"
                        >
                          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Section */}
                    {certData && !certData.isEligibleForCertificate && certData.certifications.length === 0 && (
                      <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">Unlock Your First Certificate</h3>
                        <p className="text-sm text-blue-700 mb-4">Complete {certData.targetSessions} mock interviews to earn the "Mock Interview Completion" badge.</p>

                        <div className="relative pt-1">
                          <div className="flex mb-2 items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                                Progress
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {certData.completedSessions} / {certData.targetSessions}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                            <div style={{ width: `${Math.min(100, (certData.completedSessions / certData.targetSessions) * 100)}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"></div>
                          </div>
                        </div>

                        <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                          Book Remaining Sessions
                        </button>
                      </div>
                    )}

                    {/* Eligible to Claim */}
                    {certData?.isEligibleForCertificate && (
                      <div className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100 flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-green-900 mb-1">🎉 You are eligible!</h3>
                          <p className="text-sm text-green-700">You've completed {certData.completedSessions} sessions. Claim your certificate now.</p>
                        </div>
                        <button onClick={handleClaimCertificate} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-green-600/20 transition-all animate-bounce">
                          Claim Certificate
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certData?.certifications.length === 0 && !certData.isEligibleForCertificate && (
                        <div className="col-span-2 text-center py-12 text-gray-400">
                          <Award className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p>No certifications earned yet.</p>
                        </div>
                      )}

                      {certData?.certifications.map((cert) => (
                        <div key={cert._id} className="bg-white p-5 rounded-2xl border border-gray-200 flex items-center justify-between hover:border-purple-200 transition-colors shadow-sm group">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-purple-100 text-purple-600`}>
                              <Award className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-900">{cert.name}</h3>
                              <p className="text-xs text-gray-500">Issued: {new Date(cert.issueDate).toLocaleDateString()} • ID: {cert.certificateId.slice(-6)}</p>
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-[#004fcb] transition-colors rounded-lg hover:bg-gray-50">
                            <Download className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            }

            {/* VIEW: REPORTS */}
            {
              activeView === 'reports' && (
                <div className="space-y-6 animate-fadeIn">
                  <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <TrendingUp className="w-5 h-5 text-emerald-600" />
                          Detailed Performance Analysis
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Detailed feedback from your sessions.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Top 10% Candidate</span>
                        <button
                          onClick={() => { setRefreshing(true); fetchSessions(); }}
                          className="p-2 text-gray-400 hover:text-[#004fcb] hover:bg-blue-50 rounded-lg transition-all"
                          title="Refresh Reports"
                        >
                          <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <SkillBar label="Communication Skills" score={85} color="bg-blue-500" />
                      <SkillBar label="Technical Knowledge" score={92} color="bg-emerald-500" />
                      <SkillBar label="Problem Solving" score={78} color="bg-amber-500" />
                      <SkillBar label="System Design" score={88} color="bg-purple-500" />
                    </div>

                    <div className="mt-8 bg-amber-50 rounded-xl p-5 border border-amber-100 flex items-start gap-3">
                      <div className="p-2 bg-amber-100 rounded-lg text-amber-600 shrink-0">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">AI Improvement Suggestion</h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          Your technical foundation is strong. Focus on structuring your system design answers with a clearer "Requirements &rarr; High Level Design &rarr; Deep Dive" approach to improve your Architect score.
                        </p>
                      </div>
                    </div>
                  </section>
                </div>
              )
            }

            {/* VIEW: SAVED EXPERTS */}
            {
              activeView === 'saved' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          <Bookmark className="w-5 h-5 text-[#004fcb]" />
                          Saved Experts
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Your shortlisted mentors and interviewers</p>
                      </div>
                      <button
                        onClick={() => { setRefreshing(true); fetchSessions(); }}
                        className="p-2 text-gray-400 hover:text-[#004fcb] hover:bg-blue-50 rounded-lg transition-all"
                        title="Refresh Saved Experts"
                      >
                        <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                      </button>
                    </div>

                    {savedLoading ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-48 bg-gray-50 rounded-xl animate-pulse border border-gray-100"></div>
                        ))}
                      </div>
                    ) : savedExperts.length === 0 ? (
                      <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                        <Bookmark className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="font-bold text-gray-900">No saved experts yet</h3>
                        <p className="text-sm text-gray-500 mb-4">Start exploring experts and save them here.</p>
                        <button onClick={() => navigate('/')} className="text-[#004fcb] font-bold text-sm hover:underline">Find Experts</button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {savedExperts.map(expert => (
                          <SavedExpertCard key={expert.id} expert={expert} onRefresh={fetchSavedExperts} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )
            }

          </div>
        </div>
      </div>

      <Footer />

    </div>
  );
};



export default MySessions;
