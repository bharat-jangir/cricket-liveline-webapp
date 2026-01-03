import { NewsCard } from "./NewsCard";

export function NewsFeed() {
  const news = [
    {
      title: "Hardik Pandya returns to Mumbai Indians camp ahead of IPL 2025",
      excerpt: "The Mumbai Indians skipper has joined the training camp in Mumbai as the team gears up for the upcoming season.",
      time: "2 hours ago",
      category: "IPL 2025",
      imageUrl: "https://images.unsplash.com/photo-1631194758628-71ec7c35137e?q=80&w=200&auto=format&fit=crop" // Placeholder
    },
    {
      title: "Australia announce squad for the upcoming Test series against India",
      excerpt: "Pat Cummins to lead the side as Australia looks to reclaim the Border-Gavaskar Trophy on home soil.",
      time: "5 hours ago",
      category: "AUS vs IND",
      imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?q=80&w=200&auto=format&fit=crop" // Placeholder
    },
    {
      title: "Virat Kohli hits the nets in Perth, looks in ominous touch",
      excerpt: "The Indian batting maestro was seen practicing intensely at the WACA ground ahead of the first Test.",
      time: "8 hours ago",
      category: "Team India",
      imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?q=80&w=200&auto=format&fit=crop" // Placeholder
    },
    {
      title: "Rashid Khan becomes the fastest bowler to reach 100 T20I wickets",
      excerpt: "The Afghan spin wizard achieved the milestone in just his 53rd match, breaking the previous record.",
      time: "12 hours ago",
      category: "Records",
      imageUrl: "https://images.unsplash.com/photo-1593341646782-e0b495cffd32?q=80&w=200&auto=format&fit=crop" // Placeholder
    },
     {
      title: "BCCI announces schedule for the domestic season 2025-26",
      excerpt: "The Ranji Trophy will kick off in October, with the Syed Mushtaq Ali Trophy scheduled for January.",
      time: "1 day ago",
      category: "Domestic Cricket",
       imageUrl: "https://images.unsplash.com/photo-1589801258579-18e091f4ae26?q=80&w=200&auto=format&fit=crop" // Placeholder
    },
  ];

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center bg-[#161b23]">
        <h2 className="text-[16px] font-bold text-white flex items-center gap-2">
            <span className="w-1 h-5 bg-[#3b96ff] rounded-full"></span>
            Top Stories
        </h2>
        <button className="text-[12px] text-[#3b96ff] hover:text-white font-semibold transition-colors bg-[#3b96ff]/10 px-3 py-1.5 rounded-full">
            View All
        </button>
      </div>
      <div className="flex flex-col">
        {news.map((item, index) => (
          <NewsCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
