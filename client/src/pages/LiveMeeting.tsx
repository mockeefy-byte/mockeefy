import { useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { toast } from "sonner";
import { useAuth } from '../context/AuthContext';
import { JitsiMeetingWrapper } from './meeting/JitsiMeetingWrapper';

export default function LiveMeetingPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const meetingId = searchParams.get('meetingId');
  const role = searchParams.get('role') || user?.role || location.state?.role;

  useEffect(() => {
    if (!meetingId) {
      toast.error("Invalid Meeting ID");
      navigate('/dashboard');
    }
  }, [meetingId, navigate]);

  if (!meetingId || !user) return <div className="h-screen bg-[#202124] flex items-center justify-center text-white">Loading...</div>;

  const handleMeetingClosed = () => {
    navigate(role === 'expert' ? '/dashboard/sessions' : '/my-sessions');
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#202124]">
      {/* Jitsi Wrapper takes full height */}
      <JitsiMeetingWrapper
        meetingId={meetingId}
        userName={user.name || "User"}
        userEmail={user.email}
        onReadyToClose={handleMeetingClosed}
      />
    </div>
  );
}
