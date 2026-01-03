import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export function SidebarWidgets() {
  return (
    <div className="space-y-6">
      
      {/* POINTS TABLE WIDGET */}
      <Card className="bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33]">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-[#252a33]">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
              Points Table (IPL 2025)
            </CardTitle>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
              <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a2338]/50">
                <tr>
                  <th className="px-4 py-2 font-medium">Team</th>
                  <th className="px-2 py-2 font-medium text-center">M</th>
                  <th className="px-2 py-2 font-medium text-center">Pts</th>
                  <th className="px-2 py-2 font-medium text-right">NRR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-[#252a33]">
                {[
                  { team: "CSK", m: 5, pts: 10, nrr: "+1.2" },
                  { team: "MI", m: 5, pts: 8, nrr: "+0.8" },
                  { team: "RCB", m: 5, pts: 6, nrr: "-0.2" },
                  { team: "GT", m: 5, pts: 4, nrr: "-0.5" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#1a2338]/30 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-gray-900 dark:text-white">
                      {i + 1}. {row.team}
                    </td>
                    <td className="px-2 py-2.5 text-center text-gray-600 dark:text-gray-400">{row.m}</td>
                    <td className="px-2 py-2.5 text-center font-bold text-gray-900 dark:text-white">{row.pts}</td>
                    <td className="px-2 py-2.5 text-right text-gray-600 dark:text-gray-400">{row.nrr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-2">
            <Button variant="ghost" className="w-full text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 h-8">
              View Full Table
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* ICC RANKINGS WIDGET */}
      <Card className="bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33]">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-[#252a33]">
          <CardTitle className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            ICC Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          {[
            { type: "Test Team", team: "India", rank: 1 },
            { type: "ODI Team", team: "Australia", rank: 1 },
            { type: "T20I Team", team: "India", rank: 1 }
          ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.type}</span>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-[#1a2338] px-2 py-1 rounded">
                <span className="text-xs font-bold text-gray-900 dark:text-white">{item.rank}. {item.team}</span>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full text-xs h-8 border-blue-200 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20">
            View All Rankings
          </Button>
        </CardContent>
      </Card>

      {/* TRENDING SERIES WIDGET */}
      <Card className="bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33]">
        <CardHeader className="pb-3 border-b border-gray-100 dark:border-[#252a33]">
          <CardTitle className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">
            Trending Series
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          {[
            "IPL 2025",
            "Border-Gavaskar Trophy",
            "Champions Trophy 2025",
            "PSL 2025"
          ].map((s, i) => (
            <div
              key={i}
              className="p-3 hover:bg-gray-50 dark:hover:bg-[#1a2338]/50 rounded-lg cursor-pointer transition-colors group"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {s}
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
