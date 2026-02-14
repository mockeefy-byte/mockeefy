import { Star, Shield, CheckCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getProfileImageUrl } from "../lib/imageUtils";

// Types
export interface MentorProfile {
    id: string;
    expertID: string;
    name: string;
    role: string;
    company?: string;
    location: string;
    rating: number;
    reviews: number;
    avatar: string;
    activeTime?: string;
    isVerified: boolean;
    price: string;
    skills: string[];
    experience: string;
    totalSessions: number;
    category?: string;
    allTags?: string[];
}

export const MentorJobCard = ({ mentor }: { mentor: MentorProfile }) => {
    const navigate = useNavigate();

    const handleBookNow = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/book-session`, {
            state: {
                expertId: mentor.expertID,
                profile: { ...mentor }
            }
        });
    };

    const handleCardClick = () => {
        navigate(`/book-session`, {
            state: {
                expertId: mentor.expertID,
                profile: { ...mentor }
            }
        });
    };

    return (
        <div
            onClick={handleCardClick}
            className="
                group relative bg-white rounded-xl border border-gray-100 
                w-full md:w-[320px] md:min-w-[320px]
                h-[220px] 
                flex flex-col
                transition-all duration-300 ease-out
                hover:shadow-xl hover:border-blue-200 hover:-translate-y-1
                cursor-pointer snap-start overflow-hidden shadow-sm
            "
        >
            {/* Top Section: Identity */}
            <div className="p-4 flex items-start gap-3 relative">
                {/* Badge (Top Right Absolute) */}
                <div className="absolute top-4 right-4 flex flex-col items-end gap-1">
                    {mentor.isVerified && (
                        <span className="bg-blue-50 text-[#004fcb] text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                            <Shield className="w-3 h-3 fill-current" /> Verified
                        </span>
                    )}
                    {mentor.rating >= 4.8 && (
                        <span className="bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-100 flex items-center gap-1">
                            <Star className="w-3 h-3 fill-current" /> Top Rated
                        </span>
                    )}
                </div>

                {/* Avatar */}
                <div className="shrink-0 relative">
                    <img
                        src={mentor.avatar}
                        alt={mentor.name}
                        className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md group-hover:border-blue-100 transition-colors"
                        onError={(e) => { e.currentTarget.src = getProfileImageUrl(null); }}
                    />
                    <div className="absolute bottom-0 right-0 bg-green-500 w-3 h-3 rounded-full border-2 border-white"></div>
                </div>

                {/* Name & Role */}
                <div className="flex-1 min-w-0 pr-16 pt-0.5">
                    <h3 className="font-bold text-gray-900 text-base truncate group-hover:text-[#004fcb] transition-colors leading-tight">
                        {mentor.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 truncate mt-0.5" title={mentor.role}>
                        {mentor.role}
                    </p>
                    {mentor.company && (
                        <p className="text-[10px] font-semibold text-gray-400 truncate mt-0.5">
                            {mentor.company}
                        </p>
                    )}
                </div>
            </div>

            {/* Middle Section: Professional Details Keys */}
            <div className="px-4 pb-3 flex flex-col gap-1.5 flex-1">
                {/* Row 1: Experience & Location */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5 min-w-0">
                        <CheckCircle className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium truncate">{mentor.experience} Exp</span>
                    </div>
                </div>

                {/* Row 2: Ratings & Reviews */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        <span className="font-bold text-gray-900">{mentor.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({mentor.reviews} Reviews)</span>
                    </div>
                </div>

                {/* Row 3: Sessions */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-blue-500 fill-current" />
                        <span className="font-medium">{(mentor.totalSessions || 0) > 0 ? `${mentor.totalSessions}+ Sessions` : "New Mentor"}</span>
                    </div>
                </div>
            </div>

            {/* Footer Section: Pricing & Action */}
            <div className="mt-auto px-4 py-3 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between group-hover:bg-blue-50/30 transition-colors">
                <div className="flex flex-col">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Hourly Rate</span>
                    <span className="text-base font-bold text-gray-900">{mentor.price} <span className="text-[10px] text-gray-400 font-medium">/ hr</span></span>
                </div>

                <button
                    onClick={handleBookNow}
                    className="
                        px-5 py-1.5 
                        bg-white text-[#004fcb] border border-blue-200
                        text-xs font-bold rounded-lg
                        shadow-sm hover:bg-[#004fcb] hover:text-white hover:border-[#004fcb] hover:shadow-md
                        active:scale-95
                        transition-all duration-200
                    "
                >
                    Book Now
                </button>
            </div>
        </div>
    );
};
