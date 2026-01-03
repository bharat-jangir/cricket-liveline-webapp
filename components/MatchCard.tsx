import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MatchCardProps {
  series: string;
  matchInfo: string;
  team1: { name: string; score: string; overs?: string; flag: string };
  team2: { name: string; score: string; overs?: string; flag: string };
  status: string;
  statusColor?: string;
  matchId?: string;
}

export function MatchCard({ series, matchInfo, team1, team2, status, statusColor = "text-[#f85c5c]", matchId = "1" }: MatchCardProps) {
  return (
    <Link href={`/match/${matchId}`}>
      <Card className="min-w-[300px] md:min-w-[340px] bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33] hover:border-gray-400 dark:hover:border-gray-600 transition-colors cursor-pointer shadow-sm">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">{series}</p>
            <p className="text-[11px] text-gray-700 dark:text-white/80 mt-1">{matchInfo}</p>
          </div>
          <Badge variant="secondary" className="bg-red-50 dark:bg-[#f85c5c]/10 hover:bg-red-100 dark:hover:bg-[#f85c5c]/20 text-red-600 dark:text-[#f85c5c] rounded-sm px-2 py-0.5 text-[10px] uppercase tracking-wider font-bold border-0">
            Live
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-gray-200 dark:border-white/10">
                <AvatarImage src={team1.flag} />
                <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">{team1.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-bold text-[15px] text-gray-900 dark:text-white">{team1.name}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[15px] text-gray-900 dark:text-white">{team1.score}</span>
              {team1.overs && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({team1.overs})</span>}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Avatar className="w-8 h-8 border border-gray-200 dark:border-white/10">
                <AvatarImage src={team2.flag} />
                <AvatarFallback className="bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">{team2.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-bold text-[15px] text-gray-900 dark:text-white">{team2.name}</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-[15px] text-gray-900 dark:text-white">{team2.score}</span>
              {team2.overs && <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({team2.overs})</span>}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-[#252a33] pt-3">
          <p className={cn("text-xs font-medium", statusColor)}>{status}</p>
        </div>
      </CardContent>
    </Card>
    </Link>
  );
}
