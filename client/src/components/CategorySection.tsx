import { useRef, useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { MentorJobCard, MentorProfile } from "./MentorJobCard";

interface CategorySectionProps {
    title: string;
    profiles: MentorProfile[];
    onSeeAll?: () => void;
}

export const CategorySection = ({ title, profiles, onSeeAll }: CategorySectionProps) => {
    const rowRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);

    const checkScroll = () => {
        if (rowRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
            setShowLeftArrow(scrollLeft > 0);
            // Tolerance of 10px
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [profiles]);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            // Scroll by one card width (320px) + gap (12px)
            const scrollAmount = 332;
            rowRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
            setTimeout(checkScroll, 350);
        }
    };

    // Drag Events
    const handleMouseDown = (e: React.MouseEvent) => {
        if (!rowRef.current) return;
        setIsDragging(true);
        setStartX(e.pageX - rowRef.current.offsetLeft);
        setScrollLeft(rowRef.current.scrollLeft);
    };

    const handleMouseLeave = () => {
        setIsDragging(false);
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging || !rowRef.current) return;
        e.preventDefault();
        const x = e.pageX - rowRef.current.offsetLeft;
        const walk = (x - startX) * 1.5; // Scroll-fast
        rowRef.current.scrollLeft = scrollLeft - walk;
        checkScroll();
    };

    return (
        <section className="mb-6 bg-white border border-gray-200/60 rounded-2xl p-5 shadow-sm relative group/section hover:shadow-md transition-shadow duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col gap-0.5">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h2>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Top Rated Mentors</p>
                </div>
                {onSeeAll && (
                    <button
                        onClick={onSeeAll}
                        className="text-sm font-semibold text-[#004fcb] hover:text-[#003bb5] flex items-center gap-1 transition-colors group px-3 py-1.5 rounded-full hover:bg-blue-50"
                    >
                        View all <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                )}
            </div>

            {/* Scroll Wrapper Container */}
            <div className="relative -mx-5 px-5"> {/* Negative margin to allow full-width scroll effect within padded card */}
                {/* Left Arrow */}
                <button
                    onClick={() => scroll('left')}
                    className={`
                absolute left-2 top-1/2 -translate-y-1/2 z-20 
                w-9 h-9 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-full 
                flex items-center justify-center text-gray-700 hover:text-[#004fcb] hover:scale-110 transition-all
                ${!showLeftArrow ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                hidden md:flex
            `}
                    aria-label="Scroll left"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Horizontal Overflow Handling Container */}
                <div
                    ref={rowRef}
                    className={`
            flex gap-4 overflow-x-auto pb-6 pt-2 px-1 scrollbar-hide snap-x 
            ${isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'}
          `}
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    onScroll={checkScroll}
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Single-row Flex Layout */}
                    {profiles.map((profile) => (
                        <div key={profile.id} className="snap-start shrink-0">
                            {/* Extra div for each cart (wrapper) as requested */}
                            <MentorJobCard mentor={profile} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll('right')}
                    className={`
                absolute right-2 top-1/2 -translate-y-1/2 z-20 
                w-9 h-9 bg-white/90 backdrop-blur-sm border border-gray-100 shadow-lg rounded-full 
                flex items-center justify-center text-gray-700 hover:text-[#004fcb] hover:scale-110 transition-all
                ${!showRightArrow ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                hidden md:flex
            `}
                    aria-label="Scroll right"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </section>
    );
};
