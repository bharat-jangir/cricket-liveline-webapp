"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export default function RankingsPage() {
  const [activeFormat, setActiveFormat] = useState("T20I");

  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#090c0f] flex flex-col transition-colors duration-300 font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-6 py-6 md:py-8 space-y-6 md:space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">ICC Cricket Rankings</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Official International Cricket Council rankings for men and women</p>
          </div>

          <div className="bg-white dark:bg-[#161b23] p-1 rounded-lg border border-gray-200 dark:border-[#252a33] flex gap-1 shadow-sm">
            {["Men", "Women"].map((gender) => (
              <button
                key={gender}
                className={`px-6 py-1.5 text-sm font-bold rounded-md transition-all ${
                  gender === "Men" 
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-sm" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2338]"
                }`}
              >
                {gender}
              </button>
            ))}
          </div>
        </div>

        {/* FORMAT TABS */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {["Test", "ODI", "T20I"].map((format) => (
            <button
              key={format}
              onClick={() => setActiveFormat(format)}
              className={`rounded-full h-9 px-6 text-sm font-bold transition-all shrink-0 ${
                activeFormat === format 
                  ? "bg-[#3b96ff] text-white shadow-md" 
                  : "bg-white dark:bg-[#161b23] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#252a33] hover:bg-gray-50 dark:hover:bg-[#1a2338]"
              }`}
            >
              {format}
            </button>
          ))}
        </div>

        {/* RANKINGS CONTENT */}
        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 dark:border-[#252a33] rounded-none h-auto p-0 mb-6 overflow-x-auto scrollbar-hide">
            {["Teams", "Batting", "Bowling", "All-rounders"].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab.toLowerCase()}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#3b96ff] data-[state=active]:text-[#3b96ff] dark:data-[state=active]:text-[#3b96ff] px-4 md:px-6 py-3 bg-transparent font-bold text-gray-500 dark:text-gray-400 shrink-0"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="teams" className="mt-0">
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 lg:gap-8">
              
              {/* TOP RANKED CARD */}
              <div className="lg:col-span-4">
                <Card className="bg-gradient-to-br from-[#161b23] to-[#0c1220] border-gray-800 text-white overflow-hidden relative h-full shadow-xl">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#3b96ff]/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                  <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center h-full relative z-10">
                    <div className="mb-6 md:mb-8 relative">
                      <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-white flex items-center justify-center p-2 shadow-2xl relative z-10 ring-4 ring-[#3b96ff]/20">
                        <span className="text-2xl md:text-3xl font-black text-black">IND</span>
                      </div>
                      <div className="absolute -bottom-3 md:-bottom-4 left-1/2 -translate-x-1/2 bg-[#3b96ff] text-white text-xs font-black px-3 md:px-4 py-1 md:py-1.5 rounded-full border-4 border-[#0c1220] shadow-lg uppercase tracking-wider">
                        Rank 1
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">India</h2>
                    <p className="text-gray-400 mb-6 md:mb-8 font-medium">Rating: <span className="text-white font-bold">264</span></p>
                    <div className="grid grid-cols-2 gap-3 md:gap-4 w-full">
                      <div className="bg-white/5 rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/5">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Matches</p>
                        <p className="text-xl md:text-2xl font-black">52</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 md:p-4 backdrop-blur-sm border border-white/5">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Points</p>
                        <p className="text-xl md:text-2xl font-black">13,728</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* RANKINGS TABLE */}
              <div className="lg:col-span-8">
                <Card className="bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33] overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-[#1a2338]/50 uppercase tracking-wider border-b border-gray-100 dark:border-[#252a33]">
                        <tr>
                          <th className="px-6 py-4 font-bold w-20 text-center">Rank</th>
                          <th className="px-6 py-4 font-bold">Team</th>
                          <th className="px-6 py-4 font-bold text-center">Matches</th>
                          <th className="px-6 py-4 font-bold text-center">Points</th>
                          <th className="px-6 py-4 font-bold text-right">Rating</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-[#252a33]">
                        {[
                          { rank: 2, team: "Australia", matches: 45, points: "11,250", rating: 250 },
                          { rank: 3, team: "England", matches: 38, points: "9,120", rating: 240 },
                          { rank: 4, team: "South Africa", matches: 32, points: "7,680", rating: 240 },
                          { rank: 5, team: "New Zealand", matches: 40, points: "9,200", rating: 230 },
                          { rank: 6, team: "Pakistan", matches: 42, points: "9,240", rating: 220 },
                          { rank: 7, team: "West Indies", matches: 35, points: "7,000", rating: 200 },
                          { rank: 8, team: "Sri Lanka", matches: 36, points: "6,840", rating: 190 },
                          { rank: 9, team: "Bangladesh", matches: 30, points: "5,400", rating: 180 },
                          { rank: 10, team: "Afghanistan", matches: 28, points: "4,760", rating: 170 },
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50 dark:hover:bg-[#1a2338]/30 transition-colors group">
                            <td className="px-6 py-4 text-center font-black text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{row.rank}</td>
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white flex items-center gap-3">
                              <span className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded shadow-sm inline-block"></span>
                              {row.team}
                            </td>
                            <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400 font-medium">{row.matches}</td>
                            <td className="px-6 py-4 text-center text-gray-600 dark:text-gray-400 font-medium">{row.points}</td>
                            <td className="px-6 py-4 text-right font-black text-gray-900 dark:text-white">{row.rating}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>

            </div>
          </TabsContent>
          
          <TabsContent value="batting">
            <div className="p-10 text-center text-gray-500">Batting rankings content placeholder</div>
          </TabsContent>
          <TabsContent value="bowling">
            <div className="p-10 text-center text-gray-500">Bowling rankings content placeholder</div>
          </TabsContent>
          <TabsContent value="all-rounders">
            <div className="p-10 text-center text-gray-500">All-rounders rankings content placeholder</div>
          </TabsContent>
        </Tabs>

      </main>
      <Footer />
    </div>
  );
}
