import { Check, Zap } from "lucide-react";

export const ProFeatureBanner = () => {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-orange-100 shadow-sm relative overflow-hidden mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">

                {/* Left Content */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <span className="text-2xl">👑</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                Upgrade to Pro
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                                You are missing out on premium features
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Check className="w-4 h-4 text-orange-500" />
                            <span>Unlimited AI Mocks</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Check className="w-4 h-4 text-orange-500" />
                            <span>Expert Referrals</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Check className="w-4 h-4 text-orange-500" />
                            <span>Priority Support</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                            <Check className="w-4 h-4 text-orange-500" />
                            <span>AI Enhanced Profile</span>
                        </div>
                    </div>
                </div>

                {/* Right Action */}
                <div className="flex flex-col items-center gap-2 min-w-[180px]">
                    <button className="w-full bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-orange-200 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        Become a Pro
                    </button>
                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                        25% OFF Limited Time
                    </span>
                </div>
            </div>

            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-200/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
        </div>
    );
};
