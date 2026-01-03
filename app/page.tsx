import { Navbar } from "@/components/Navbar";
import { MatchCarousel } from "@/components/MatchCarousel";
import { NewsFeed } from "@/components/NewsFeed";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { SidebarWidgets } from "@/components/SidebarWidgets";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#090c0f] flex flex-col transition-colors duration-300">
      <Navbar />

      {/* Live Score Strip */}
      <div className="bg-white dark:bg-[#0c1220] border-b border-gray-200 dark:border-[#1a2338] py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Live Matches
            </h2>
            <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              View All Matches
            </span>
          </div>
          <MatchCarousel />
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
        
        {/* Hero Section (Featured News) */}
        <HeroSection />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT — NEWS FEED */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#252a33] pb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Latest News</h3>
              <div className="flex gap-2">
                {["All", "Match Reports", "Interviews", "Specials"].map((tab, i) => (
                  <button 
                    key={i}
                    className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                      i === 0 
                        ? "bg-black dark:bg-white text-white dark:text-black" 
                        : "bg-gray-100 dark:bg-[#1a2338] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#252a33]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            <NewsFeed />

            {/* Ad Banner */}
            <div className="bg-gray-100 dark:bg-[#161b23] rounded-xl border border-gray-200 dark:border-[#252a33] p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                Ad Space / Promotional Content
              </p>
            </div>
          </div>

          {/* RIGHT — SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <SidebarWidgets />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
