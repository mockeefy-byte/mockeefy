import { useMemo, useState, useEffect } from "react";
import { CategorySection } from "./CategorySection";
import { MentorJobCard, MentorProfile } from "./MentorJobCard";
import { CheckCircle, AlertCircle } from "lucide-react";
import axios from '../lib/axios';
import { getProfileImageUrl } from "../lib/imageUtils";
import { useQuery } from "@tanstack/react-query";
import { calculateAge, calculateProfessionalExperience, getCurrentCompany, getJobTitle } from "../lib/expertUtils";



export default function CoachSessionCard() {
  // State for Mobile Tabs
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch Experts (Public Access)
  const {
    data: expertsData,
    isLoading: isExpertsLoading,
    isError: isExpertsError,
    error: expertsError
  } = useQuery({
    queryKey: ["experts"],
    queryFn: async () => {
      const res = await axios.get("/api/expert/verified");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Fetch Categories
  const {
    data: categoriesData,
    isLoading: isCategoriesLoading
  } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await axios.get("/api/categories");
      return res.data;
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Process Experts
  const allProfiles = useMemo<MentorProfile[]>(() => {
    if (isExpertsLoading && !expertsData) return [];

    let rawExperts: any[] = [];
    if (expertsData?.success && Array.isArray(expertsData?.data)) {
      rawExperts = expertsData.data;
    } else if (Array.isArray(expertsData)) {
      rawExperts = expertsData;
    }

    return rawExperts.map((expert: any) => {
      // Logic from previous implementation to map backend data to MentorProfile
      const cat = expert.personalInformation?.category || "IT";
      let exp = "";
      if (expert.professionalDetails?.totalExperience) {
        exp = expert.professionalDetails.totalExperience === 1 ? "1 year" : `${expert.professionalDetails.totalExperience} years`;
      } else {
        exp = calculateProfessionalExperience(expert.professionalDetails) || (calculateAge(expert.personalInformation?.dob) - 22 > 0 ? `${calculateAge(expert.personalInformation?.dob) - 22}+ years` : "Fresher");
      }

      // Safe skill extraction
      const skills = (() => {
        if (expert.expertSkills && expert.expertSkills.length > 0) {
          return expert.expertSkills
            .filter((s: any) => s.isEnabled && s.skillName)
            .map((s: any) => s.skillName);
        }
        return [...(expert.skillsAndExpertise?.domains || []), ...(expert.skillsAndExpertise?.tools || [])];
      })();

      return {
        id: expert._id || expert.userId,
        expertID: expert._id || expert.userId,
        name: expert.personalInformation?.userName || "Expert",
        role: getJobTitle(expert.professionalDetails, cat),
        company: getCurrentCompany(expert.professionalDetails, cat), // Added company
        location: expert.personalInformation?.city || "Online",
        rating: expert.metrics?.avgRating || 0,
        reviews: expert.metrics?.totalReviews || 0,
        avatar: getProfileImageUrl(expert.profileImage),
        isVerified: expert.status === "Active",
        price: expert.price ? `₹${expert.price}` : "₹500",
        skills: skills,
        experience: exp,
        totalSessions: expert.metrics?.totalSessions || 0,
        // Helper for filtering
        category: cat,
        // We'll also treat skills as potential categories for matching
        allTags: [cat, ...skills, expert.professionalDetails?.industry].filter(Boolean).map(s => s.toString())
      } as MentorProfile & { category: string, allTags: string[] };
    });
  }, [expertsData, isExpertsLoading]);


  // Helper to categorize profiles
  const categorizedProfiles = useMemo(() => {
    if (!categoriesData || !Array.isArray(categoriesData)) return [];

    const sections: { title: string, profiles: MentorProfile[] }[] = [];

    // Map backend categories to section titles
    // Assuming backend returns array of objects with 'name' property
    const validCategories = categoriesData
      .filter((c: any) => c.status !== 'Inactive') // Filter active ONLY if status exists, otherwise assume all
      .map((c: any) => c.name);

    validCategories.forEach((sectionTitle: string) => {
      const sectionProfiles = allProfiles.filter(p => {
        // Match by explicit Category OR by Skill/Tag
        // This is a loose match to ensure we populate sections
        const lowerTitle = sectionTitle.toLowerCase();

        // Direct category match
        if (p.category && p.category.toLowerCase().includes(lowerTitle)) return true;

        // Skill match (e.g. "React" skill -> "React" section)
        if (p.allTags && p.allTags.some(t => t.toLowerCase().includes(lowerTitle))) return true;

        return false;
      });

      if (sectionProfiles.length > 0) {
        // Sort by Rating/Quality
        const sorted = sectionProfiles.sort((a, b) => b.rating - a.rating);
        sections.push({
          title: sectionTitle,
          profiles: sorted
        });
      }
    });



    return sections;

  }, [allProfiles, categoriesData]);




  useEffect(() => {
    if (categorizedProfiles.length > 0 && !selectedCategory) {
      setSelectedCategory(categorizedProfiles[0].title);
    }
  }, [categorizedProfiles]);


  if (isExpertsLoading || isCategoriesLoading) {
    return (
      <div className="space-y-8 pl-1">
        {[1, 2, 3].map(i => (
          <div key={i} className="animate-pulse">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
            <div className="flex gap-4 overflow-hidden">
              <div className="w-[320px] h-[220px] bg-gray-100 rounded-xl shrink-0"></div>
              <div className="w-[320px] h-[220px] bg-gray-100 rounded-xl shrink-0"></div>
              <div className="w-[320px] h-[220px] bg-gray-100 rounded-xl shrink-0"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isExpertsError) {
    return (
      <div className="text-center py-20 text-red-500 font-medium bg-red-50 rounded-xl border border-red-100">
        <AlertCircle className="w-10 h-10 mx-auto mb-2 text-red-400" />
        <p>Failed to load experts.</p>
        <p className="text-sm opacity-75 mt-1">{expertsError instanceof Error ? expertsError.message : "Unknown error"}</p>
      </div>
    )
  }

  if (categorizedProfiles.length === 0) {
    return (
      <div className="text-center py-32">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">No experts found</h3>
        <p className="text-gray-500 text-sm mt-1">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* MOBILE VIEW (Tabs + Vertical List) */}
      <div className="lg:hidden space-y-6">
        {/* Category Tabs */}
        <div className="overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
          <div className="flex items-center gap-2">
            {categorizedProfiles.map((section) => (
              <button
                key={section.title}
                onClick={() => setSelectedCategory(section.title)}
                className={`
                            whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all border
                            ${selectedCategory === section.title
                    ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }
                        `}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Vertical List for Selected Category */}
        <div className="space-y-4">
          {categorizedProfiles.find(c => c.title === selectedCategory)?.profiles.map((profile) => (
            <MentorJobCard key={profile.id} mentor={profile} />
          )) || (
              <div className="text-center py-10 text-gray-500">No experts in this category.</div>
            )}
        </div>
      </div>

      {/* DESKTOP VIEW (Vertical Stack of Horizontal Scroll Sections) */}
      <div className="hidden lg:block space-y-6">
        {categorizedProfiles.map(section => (
          <CategorySection
            key={section.title}
            title={section.title}
            profiles={section.profiles}
            onSeeAll={() => console.log(`See all ${section.title}`)} // Placeholder for now
          />
        ))}
      </div>
    </div>
  );
}
