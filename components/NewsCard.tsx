import Image from "next/image";
import { Clock } from "lucide-react";

interface NewsCardProps {
  title: string;
  excerpt: string;
  time: string;
  category: string;
  imageUrl?: string;
}

export function NewsCard({ title, excerpt, time, category, imageUrl }: NewsCardProps) {
  return (
    <div className="flex gap-4 p-4 border-b border-border hover:bg-accent/30 transition-colors cursor-pointer group">
      <div className="w-[120px] h-[80px] md:w-[140px] md:h-[90px] bg-muted rounded-lg overflow-hidden flex-shrink-0 relative">
        {imageUrl ? (
            <Image src={imageUrl} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-gray-500 text-xs">
                No Image
            </div>
        )}
      </div>
      <div className="flex flex-col justify-between py-0.5 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
             <span className="text-[10px] font-bold text-[#3b96ff] uppercase tracking-wider">{category}</span>
             <span className="text-[10px] text-muted-foreground">•</span>
             <span className="text-[10px] text-muted-foreground">{time}</span>
          </div>
          <h3 className="text-[15px] md:text-[16px] font-bold text-white leading-snug group-hover:text-[#3b96ff] transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-[13px] text-[#8b95a5] mt-1.5 line-clamp-2 hidden md:block leading-relaxed">
            {excerpt}
          </p>
        </div>
      </div>
    </div>
  );
}
