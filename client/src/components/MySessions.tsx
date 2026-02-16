import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Video,
  RefreshCw,
  Calendar,
  ChevronRight,
  Sparkles,
  Shield,
  Briefcase,
  TrendingUp,
  Activity,
  Award,
  Heart
} from "lucide-react";
import DashboardLayout from "./DashboardLayout";
import { useAuth } from "../context/AuthContext";
import axios from '../lib/axios';
import { getProfileImageUrl } from "../lib/imageUtils";

// --- Types ---
type Session = {
  id: string;
  sessionId: string;
  expert: string;
  role: string;
  company: string;
  date: string;
  time: string;
  duration: string;
  status: string;
  score?: number;
  meetLink?: string;
  profileImage?: string | null;
  startTime?: string;
  category?: string;
};

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Upcoming: "bg-blue-50/50 text-blue-600 border-blue-100",
    Confirmed: "bg-elite-blue text-white border-blue-600",
    Completed: "bg-slate-50 text-slate-500 border-slate-200",
    Cancelled: "bg-rose-50 text-rose-600 border-rose-100",
    Live: "bg-emerald-50 text-emerald-600 border-emerald-100"
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black tracking-tight border shadow-sm ${styles[status] || styles.Completed}`}>
      {status}
    </span>
  );
}

const MySessions = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialView = (searchParams.get('view') as any) || 'overview';

  const [activeView, setActiveView] = useState(initialView);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const view = new URLSearchParams(location.search).get('view');
    if (view) setActiveView(view);
  }, [location.search]);

  const fetchSessions = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`/api/sessions/candidate/${user.id}`);
      if (res.data) {
        const mapped = res.data.map((s: any) => ({
          id: s._id,
          sessionId: s.sessionId,
          expert: s.expertDetails?.name || 'Expert',
          company: s.expertDetails?.company || '',
          profileImage: s.expertDetails?.profileImage,
          category: s.category || 'Interview',
          startTime: s.startTime,
          time: new Date(s.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: s.status.charAt(0).toUpperCase() + s.status.slice(1),
          score: s.expertReview?.overallRating ? s.expertReview.overallRating * 20 : undefined
        }));
        setSessions(mapped);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchSessions(); }, [user?.id]);

  const handleJoin = (session: Session) => {
    navigate(`/live-meeting/${session.sessionId}`, { state: { session } });
  };

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-in fade-in duration-500">

        {/* EXECUTIVE DASHBOARD PANEL */}
        {activeView === 'overview' && (
          <div className="space-y-5">
            {/* 1. UNIFIED STATS STRIP - ZERO INTERNAL GAP */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_20px_-6px_rgba(0,0,0,0.04)] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/10">
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4 text-elite-blue" />
                  <h2 className="font-elite leading-none">Operational Intel</h2>
                </div>
                <button onClick={() => { setRefreshing(true); fetchSessions(); }} className="flex items-center gap-2 px-2.5 py-1.5 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100">
                  <span className="text-[8px] font-black text-slate-400 tracking-tight uppercase">{refreshing ? 'Syncing...' : 'Sync HQ'}</span>
                  <RefreshCw size={10} className={`${refreshing ? 'animate-spin' : ''} text-slate-400`} />
                </button>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-slate-100">
                {[
                  { label: "Simulations", value: sessions.length, icon: Video, color: "text-elite-blue" },
                  { label: "Validated", value: sessions.filter(s => s.status === 'Completed').length, icon: Shield, color: "text-emerald-500" },
                  { label: "Awaiting", value: sessions.filter(s => ['Upcoming', 'Confirmed'].includes(s.status)).length, icon: Calendar, color: "text-amber-500" },
                  { label: "Tier Rank", value: "Elite", icon: TrendingUp, color: "text-rose-500" }
                ].map((stat, i) => (
                  <div key={i} className="p-5 hover:bg-blue-50/30 transition-colors group cursor-default">
                    <div className="flex items-center gap-2 mb-2">
                      <stat.icon size={12} className={stat.color} />
                      <span className="text-[9px] font-black text-slate-400 tracking-tight uppercase">{stat.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-elite-black tracking-tighter">{loading ? '...' : stat.value}</span>
                      <span className="text-[10px] font-bold text-slate-300">RT</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. RECENT SESSIONS TABLE - HIGH DENSITY */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-elite-blue" />
                  <h2 className="font-elite leading-none">Live Simulation Feed</h2>
                </div>

                <div className="flex items-center gap-4">
                  {/* Certification Progress */}
                  <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                    <div className="flex flex-col">
                      <span className="text-[7px] font-black text-slate-400 uppercase tracking-tighter">Certification Pipeline</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((i) => (
                            <div
                              key={i}
                              className={`w-3 h-1 rounded-full ${i <= sessions.filter(s => s.status === 'Completed').length ? 'bg-elite-blue' : 'bg-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-elite-blue leading-none">
                          {Math.min(3, sessions.filter(s => s.status === 'Completed').length)}/3
                        </span>
                      </div>
                    </div>
                    <Award size={14} className={sessions.filter(s => s.status === 'Completed').length >= 3 ? "text-elite-blue" : "text-slate-300"} />
                  </div>

                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-elite-blue border border-blue-100">
                    <span className="w-1 h-1 rounded-full bg-blue-500"></span>
                    <span className="text-[8px] font-black tracking-tight uppercase">Active Studio</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="px-5 py-3 text-[9px] font-black text-slate-400 tracking-tight">Candidate/Expert</th>
                      <th className="px-5 py-3 text-[9px] font-black text-slate-400 tracking-tight hidden sm:table-cell">Timeline</th>
                      <th className="px-5 py-3 text-[9px] font-black text-slate-400 tracking-tight">Status</th>
                      <th className="px-5 py-3 text-[9px] font-black text-slate-400 tracking-tight text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {loading ? (
                      [1, 2, 3].map(i => (
                        <tr key={i} className="animate-pulse">
                          <td colSpan={4} className="px-5 py-4"><div className="h-10 bg-slate-50 rounded-xl" /></td>
                        </tr>
                      ))
                    ) : sessions.length > 0 ? (
                      sessions.slice(0, 10).map(session => (
                        <tr key={session.id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/60 p-0.5 shadow-sm">
                                <img src={getProfileImageUrl(session.profileImage)} className="w-full h-full object-cover rounded-md" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-black text-slate-900 text-[11px] tracking-tight truncate">{session.category} Simulation</p>
                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{session.expert}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 hidden sm:table-cell">
                            <p className="text-[10px] font-black text-slate-800 tracking-tighter uppercase">{session.time}</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter mt-1">UTC Evaluation</p>
                          </td>
                          <td className="px-5 py-3.5">
                            <StatusBadge status={session.status} />
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {session.status === 'Completed' ? (
                                <>
                                  {sessions.filter(s => s.status === 'Completed').length >= 3 ? (
                                    <button
                                      title="View Certificate"
                                      className="p-1.5 text-slate-400 hover:text-elite-blue hover:bg-blue-50 rounded-lg transition-all"
                                    >
                                      <Award size={14} />
                                    </button>
                                  ) : (
                                    <div
                                      title="Complete 3 interviews to unlock certification"
                                      className="p-1.5 text-slate-200 cursor-not-allowed"
                                    >
                                      <Award size={14} />
                                    </div>
                                  )}
                                  <button
                                    title="Review Session"
                                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                  >
                                    <Heart size={14} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleJoin(session)}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-elite-blue hover:bg-blue-600 text-white rounded-lg text-[9px] font-black tracking-tight transition-all shadow-sm active:scale-95"
                                >
                                  Join Studio <ChevronRight size={10} strokeWidth={3} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-5 py-20 text-center">
                          <Briefcase className="w-8 h-8 text-slate-100 mx-auto mb-3" />
                          <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">No intelligence gathered</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Other views */}
        {activeView !== 'overview' && (
          <div className="bg-white rounded-2xl border border-slate-200/60 p-16 text-center shadow-sm">
            <Briefcase className="w-10 h-10 text-slate-100 mx-auto mb-4" />
            <p className="text-slate-500 text-[10px] font-black tracking-tight">Intel Core "{activeView}" Encrypted</p>
            <button onClick={() => setActiveView('overview')} className="mt-8 px-8 py-2.5 bg-elite-blue text-white rounded-xl text-[10px] font-black tracking-tight hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/10">Return to Nexus</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MySessions;
