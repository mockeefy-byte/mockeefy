interface FooterProps {
  showAds?: boolean;
  minimal?: boolean;
}

const Footer = ({ showAds = true, minimal = false }: FooterProps) => (
  <footer className="w-full border-t border-slate-100 bg-white">
    <div className={`max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ${minimal ? 'py-4' : 'py-8 md:py-10'}`}>
      {/* Job Referral & Ads Section Replace Newsletter */}
      {!minimal && showAds && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Job Referral Ad */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-2.5 1.25L12 17.5l7.5-5.25-2.5-1.25-5 2.5z" /></svg>
            </div>
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-100 text-xs font-bold rounded-full mb-4 border border-blue-400/30">
                FEATURED
              </span>
              <h3 className="text-2xl font-bold text-white mb-2">Unlock Direct Job Referrals</h3>
              <p className="text-blue-100/80 mb-6 max-w-sm">
                Complete 3 mock interviews to earn your certificate and get referred to top tech companies.
              </p>
              <a href="/dashboard" className="inline-flex items-center gap-2 bg-white text-blue-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-lg shadow-blue-900/20">
                Start Your Journey
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </a>
            </div>
          </div>

          {/* Company / Ads Grid */}
          <div className="bg-white rounded-2xl p-1 border border-slate-100 shadow-sm grid grid-cols-2 gap-1">
            <div className="bg-slate-50 rounded-xl p-5 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-blue-600">G</span>
              </div>
              <p className="font-bold text-slate-700 text-sm">Google</p>
              <p className="text-xs text-slate-400 mt-1">Hiring SDE II</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-slate-800">A</span>
              </div>
              <p className="font-bold text-slate-700 text-sm">Amazon</p>
              <p className="text-xs text-slate-400 mt-1">Hiring SDE I</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-blue-500">M</span>
              </div>
              <p className="font-bold text-slate-700 text-sm">Microsoft</p>
              <p className="text-xs text-slate-400 mt-1">Frontend Dev</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-5 flex flex-col justify-center items-center text-center hover:bg-slate-100 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <span className="font-bold text-red-500">N</span>
              </div>
              <p className="font-bold text-slate-700 text-sm">Netflix</p>
              <p className="text-xs text-slate-400 mt-1">Backend Eng</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Footer Content */}
      {!minimal && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-0 group relative h-12">
              <img src="/mockeefy.png" alt="Mockeefy" className="absolute top-[-20px] left-0 h-[90px] w-auto object-contain mix-blend-multiply" />
              <div className="font-bold text-3xl text-[#004fcb] tracking-tight ml-[90px] font-['Outfit']">Mockeefy</div>
            </div>
            <p className="text-slate-600 leading-relaxed text-sm max-w-xs">
              The world's leading <span className="text-[#004fcb] font-semibold">AI-powered</span> mock interview platform. Master your interviews with expert guidance.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-100 hover:border-[#004fcb] hover:bg-blue-50 rounded-xl flex items-center justify-center transition-all duration-300 group">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-[#004fcb] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 border border-slate-100 hover:border-[#004fcb] hover:bg-blue-50 rounded-xl flex items-center justify-center transition-all duration-300 group">
                <svg className="w-5 h-5 text-slate-400 group-hover:text-[#004fcb] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Column */}
          <div className="space-y-6">
            <h3 className="font-bold text-[#004fcb] text-sm uppercase tracking-widest">Product</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Features</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Pricing</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Use Cases</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Testimonials</a></li>
            </ul>
          </div>

          {/* Resources Column */}
          <div className="space-y-6">
            <h3 className="font-bold text-[#004fcb] text-sm uppercase tracking-widest">Resources</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Blog</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Documentation</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Support Center</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>API Status</a></li>
            </ul>
          </div>

          {/* Company Column */}
          <div className="space-y-6">
            <h3 className="font-bold text-[#004fcb] text-sm uppercase tracking-widest">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>About Us</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Careers</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Contact Us</a></li>
              <li><a href="#" className="text-slate-500 hover:text-[#004fcb] transition-all duration-200 text-sm font-medium flex items-center gap-2 group"><span className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-[#004fcb] transition-colors"></span>Partners</a></li>
            </ul>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className={`border-t border-slate-100 ${minimal ? 'pt-2' : 'pt-8'}`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-sm text-slate-400 font-medium text-center md:text-left">
            © {new Date().getFullYear()} <span className="text-[#004fcb] font-bold">Mockeefy</span>. All rights reserved.
            <p className="mt-1 text-xs text-slate-400 font-normal">Professional interview preparation with verified experts</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 text-xs font-semibold uppercase tracking-wider">
            <a href="#" className="text-slate-400 hover:text-[#004fcb] transition-all">Terms</a>
            <a href="#" className="text-slate-400 hover:text-[#004fcb] transition-all">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-[#004fcb] transition-all">Cookies</a>
            <a href="#" className="text-slate-400 hover:text-[#004fcb] transition-all">Security</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;