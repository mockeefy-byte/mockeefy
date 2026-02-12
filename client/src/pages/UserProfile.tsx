import { useState } from "react";
import { User, Phone, MapPin, Calendar, Briefcase, Award, Settings2, Bookmark, FileText } from "lucide-react";
import axios from '../lib/axios';
import { useAuth } from "../context/AuthContext";
import Navigation from "../components/Navigation";
import PersonalInfoSection from "../components/profile/PersonalInfoSection";
import EducationSection from "../components/profile/EducationSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import CertificationsSection from "../components/profile/CertificationsSection";
import SkillsSection from "../components/profile/SkillsSection";
import PreferencesSection from "../components/profile/PreferencesSection";
import ResumePreview from "../components/profile/ResumePreview";
import { useQuery } from "@tanstack/react-query";
import { getProfileImageUrl } from "../lib/imageUtils";

interface ProfileData {
    name?: string;
    email?: string;
    profileImage?: string;
    profileCompletion?: number;
    personalInfo?: {
        phone?: string;
        city?: string;
        state?: string;
        dateOfBirth?: string;
        gender?: string;
        address?: string;
    };
    education?: any[];
    experience?: any[];
    certifications?: any[];
    skills?: {
        technical?: string[];
        soft?: string[];
        languages?: string[];
    };
    preferences?: any;
}

export default function UserProfile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("personal");
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    // Replace manual fetch/state with React Query to prevent flickering
    const { data: profileData, isLoading, refetch } = useQuery({
        queryKey: ["userProfile", user?.id],
        queryFn: async () => {
            if (!user?.id) return null;
            const response = await axios.get("/api/user/profile", {
                headers: { userid: user.id }
            });
            return response.data.success ? response.data.data : null;
        },
        enabled: !!user?.id,
        staleTime: 1000 * 60 * 5, // Cache data for 5 mins to prevent unnecessary fetches
    });

    const tabs = [
        { id: "personal", label: "Personal", icon: User },
        { id: "education", label: "Education", icon: Award },
        { id: "experience", label: "Experience", icon: Briefcase },
        { id: "certifications", label: "Certificates", icon: Award },
        { id: "skills", label: "Skills", icon: Settings2 },
        { id: "preferences", label: "Preferences", icon: Calendar }
    ];

    if (isLoading) {
        return (
            <div className="h-[calc(100vh-80px)] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-[#004fcb] border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] font-sans">
            <Navigation />

            {/* Compact Header */}
            <div className="bg-white border-b border-gray-200 sticky top-[80px] z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-50 p-1.5 rounded-lg">
                                <Settings2 className="w-4 h-4 text-[#004fcb]" />
                            </div>
                            <div>
                                <h1 className="text-base font-bold text-gray-900 leading-none">Profile Settings</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Completion</p>
                                <p className="text-sm font-bold text-[#004fcb] leading-none">{profileData?.profileCompletion || 0}%</p>
                            </div>
                            <div className="w-8 h-8 relative">
                                <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#f3f4f6"
                                        strokeWidth="4"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#004fcb"
                                        strokeWidth="4"
                                        strokeDasharray={`${profileData?.profileCompletion || 0}, 100`}
                                        className="text-[#004fcb] transition-all duration-1000 ease-out"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left Sidebar - Compact Profile Card */}
                    <div className="lg:col-span-3 space-y-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Banner/Header */}
                            <div className="h-20 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                                <div className="absolute inset-0 bg-black/5"></div>
                            </div>

                            <div className="px-4 pb-4 -mt-10 text-center relative">
                                <div className="inline-block relative">
                                    <img
                                        src={getProfileImageUrl(profileData?.profileImage)}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-xl border-4 border-white object-cover shadow-sm bg-white"
                                        onError={(e) => {
                                            e.currentTarget.src = getProfileImageUrl(null);
                                        }}
                                    />
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                                </div>

                                <h3 className="text-gray-900 font-bold text-base mt-2">{profileData?.name}</h3>
                                <p className="text-gray-500 text-xs truncate max-w-[180px] mx-auto">{profileData?.email}</p>

                                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-600">
                                    {profileData?.personalInfo?.phone && (
                                        <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                            <Phone className="w-3 h-3 text-gray-400" />
                                            {profileData.personalInfo.phone}
                                        </span>
                                    )}
                                </div>
                                {profileData?.personalInfo?.city && (
                                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-center gap-1">
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        {profileData.personalInfo.city}, {profileData.personalInfo.state}
                                    </div>
                                )}
                            </div>

                            {/* Navigation Tabs - Vertical List */}
                            <div className="p-2 border-t border-gray-100 bg-gray-50/50">
                                <nav className="space-y-0.5">
                                    {tabs.map((tab) => {
                                        const Icon = tab.icon;
                                        const isActive = activeTab === tab.id;
                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className={`
                                                    w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all
                                                    ${isActive
                                                        ? "bg-white text-[#004fcb] shadow-sm border border-gray-200"
                                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                                    }
                                                `}
                                            >
                                                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#004fcb]" : "text-gray-400"}`} />
                                                {tab.label}
                                            </button>
                                        );
                                    })}
                                </nav>

                                <button
                                    onClick={() => setIsResumeOpen(true)}
                                    className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#004fcb] to-indigo-600 hover:shadow-md transition-all active:scale-95"
                                >
                                    <FileText className="w-3.5 h-3.5" />
                                    Resume
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Cards */}
                    <div className="lg:col-span-9">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 min-h-[400px]">
                            {activeTab === "personal" && (
                                <PersonalInfoSection profileData={profileData} onUpdate={refetch} />
                            )}
                            {activeTab === "education" && (
                                <EducationSection profileData={profileData} onUpdate={refetch} />
                            )}
                            {activeTab === "experience" && (
                                <ExperienceSection profileData={profileData} onUpdate={refetch} />
                            )}
                            {activeTab === "certifications" && (
                                <CertificationsSection profileData={profileData} onUpdate={refetch} />
                            )}
                            {activeTab === "skills" && (
                                <SkillsSection profileData={profileData} onUpdate={refetch} />
                            )}
                            {activeTab === "preferences" && (
                                <PreferencesSection profileData={profileData} onUpdate={refetch} />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Resume Preview Modal */}
            <ResumePreview isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </div>
    );
}
