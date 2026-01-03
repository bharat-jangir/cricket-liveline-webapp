import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { MatchCard } from "./MatchCard";

export function MatchCarousel() {
  const matches = [
    {
      series: "ICC Champions Trophy, 2025",
      matchInfo: "9th Match • Dubai",
      team1: { name: "AUS", score: "189/6", overs: "34.2", flag: "" },
      team2: { name: "ENG", score: "287/8", overs: "50", flag: "" },
      status: "Australia need 99 runs in 94 balls",
      statusColor: "text-blue-500",
    },
    {
      series: "Ranji Trophy Elite 2024-25",
      matchInfo: "Final • Mumbai",
      team1: { name: "MUM", score: "450 & 120/3", overs: "", flag: "" },
      team2: { name: "VID", score: "380", overs: "", flag: "" },
      status: "Mumbai lead by 190 runs",
      statusColor: "text-orange-500",
    },
    {
      series: "PSL 2025",
      matchInfo: "12th Match • Lahore",
      team1: { name: "LQ", score: "178/5", overs: "20", flag: "" },
      team2: { name: "KK", score: "145/2", overs: "14.1", flag: "" },
      status: "Karachi Kings need 34 runs in 35 balls",
      statusColor: "text-green-500",
    },
    {
        series: "Test Series",
        matchInfo: "1st Test • Perth",
        team1: { name: "IND", score: "350", overs: "", flag: "" },
        team2: { name: "AUS", score: "120/2", overs: "35", flag: "" },
        status: "Day 2: Stumps - Australia trail by 230 runs",
        statusColor: "text-blue-500",
      },
      {
        series: "BPL 2025",
        matchInfo: "24th Match • Dhaka",
        team1: { name: "CV", score: "165/7", overs: "20", flag: "" },
        team2: { name: "RR", score: "140/4", overs: "16.2", flag: "" },
        status: "Rangpur Riders need 26 runs in 22 balls",
        statusColor: "text-green-500",
      },
  ];

  return (
    <div className="w-full px-1">
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {matches.map((match, index) => (
            <CarouselItem key={index} className="pl-4 basis-auto">
              <MatchCard {...match} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-0 bg-white/80 dark:bg-[#1a2338]/80 hover:bg-white dark:hover:bg-[#2a3348] border-gray-200 dark:border-[#2a3348] text-black dark:text-white shadow-md z-10" />
        <CarouselNext className="hidden md:flex right-0 bg-white/80 dark:bg-[#1a2338]/80 hover:bg-white dark:hover:bg-[#2a3348] border-gray-200 dark:border-[#2a3348] text-black dark:text-white shadow-md z-10" />
      </Carousel>
    </div>
  );
}
