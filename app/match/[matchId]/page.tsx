"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MatchPage() {
  // State for toggling between probability and odds view
  const [viewMode, setViewMode] = useState<"probability" | "odds">("probability");
  
  // State for active innings selection in scorecard
  const [activeInnings, setActiveInnings] = useState<string>("sa-1st");
  
  // Match format - can be "ODI", "T20", or "Test"
  const matchFormat: "ODI" | "T20" | "Test" = "ODI"; // This would come from props/API in real implementation
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0e1a] flex flex-col font-sans">
      <Navbar />

      {/* Match Header */}
<div className="bg-[#0f1419] min-h-[100px]">
  <div className="container mx-auto px-3 md:px-4 py-2 md:py-3">

    {/* Series Info */}
    <p className="text-gray-400 text-[10px] md:text-xs mb-2 md:mb-4">
      IND vs SA, 1st ODI, SA vs IND 2025 info
    </p>

    {/* MOBILE: Score + Live Ball together */}
    <div className="flex md:hidden justify-between items-center gap-4">

      {/* Score */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-700 bg-white shrink-0">
          <img
            src="https://flagcdn.com/w80/in.png"
            alt="India"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-1">
            <p className="text-white font-bold text-sm">IND</p>
            <span className="bg-red-600 text-white text-[8px] font-bold px-1 py-0.5 rounded">
              PPD
            </span>
          </div>
          <div className="flex items-center gap-1">
            <p className="text-white font-bold text-lg">204-4</p>
            <span className="text-gray-400 text-[10px]">31.3</span>
          </div>
        </div>
      </div>

      {/* Live Ball */}
      <div className="flex flex-[0.5] items-center justify-center">
        <div className="w-full h-full p-2  bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
          <span className="text-lg center font-bold text-white">Ball In Air But Not Guranteed</span>
        </div>
      </div>
    </div>

    {/* MOBILE: Match Info below full width */}
    <div className="mt-3 justify-between flex md:hidden text-right">
      <p className="text-gray-400 text-[10px]">CRR: 6.48</p>
      <p className="text-yellow-400 text-[10px] font-semibold mt-0.5">
        SA opt to Bowl
      </p>
    </div>

    {/* DESKTOP VIEW (3 Columns) */}
    <div className="hidden md:grid grid-cols-3 items-center gap-4 mt-4">

      {/* Score */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 bg-white shrink-0">
          <img
            src="https://flagcdn.com/w80/in.png"
            alt="India"
            className="w-full h-full object-cover"
          />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <p className="text-white font-bold text-2xl">IND</p>
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              PPD
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-white font-bold text-3xl">204-4</p>
            <span className="text-gray-400 text-sm">31.3</span>
          </div>
        </div>
      </div>

      {/* Live Ball */}
      <div className="flex items-center justify-center bg-red-600">
        <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
          <span className="text-lg center font-bold text-gray-900">Ball In Air But Not Guranteed</span>
        </div>
      </div>

      {/* Match Info */}
      <div className="text-right">
        <p className="text-gray-400 text-xs">CRR: 6.48</p>
        <p className="text-yellow-400 text-sm font-semibold mt-1">
          SA opt to Bowl
        </p>
      </div>
    </div>
  </div>
</div>


      {/* Tabs */}
      <Tabs defaultValue="scorecard" className="flex-1">
        <div className="bg-white dark:bg-[#0f1419] border-b border-gray-200 dark:border-gray-800 sticky top-0 z-10">
          <div className="container mx-auto px-4">
            <TabsList className="h-auto w-full justify-start bg-transparent p-0 border-b-0 rounded-none overflow-x-auto scrollbar-hide">
              {[
                { value: "match-info", label: "Match info" },
                { value: "live", label: "Live" },
                { value: "scorecard", label: "Scorecard" },
                { value: "points-table", label: "Points Table" }
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 data-[state=active]:bg-transparent bg-transparent px-6 py-4 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white data-[state=active]:shadow-none shrink-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 bg-gray-50 dark:bg-[#0a0e1a] py-6">
          <div className="container mx-auto px-4">
            
            {/* Match Info Tab */}
            <TabsContent value="match-info" className="mt-0">
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Match Details */}
              <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Match Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Series</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">South Africa tour of India 2025</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Match</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">1st ODI</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Saturday, November 30, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">2:00 PM IST</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Venue</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Wankhede Stadium, Mumbai</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toss</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">India won the toss and elected to bat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Team Form */}
              <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Team Form (Last 5 matches)</h3>
                  
                  {/* India Form */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🇮🇳 India</h4>
                    <div className="flex gap-2 flex-wrap">
                      {["W", "L", "L", "W", "W"].map((result, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            result === "W"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* South Africa Form */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">🇿🇦 South Africa</h4>
                    <div className="flex gap-2 flex-wrap">
                      {["L", "W", "L", "L", "W"].map((result, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            result === "W"
                              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          }`}
                        >
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Head to Head */}
              <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Head to Head (Last 10 matches)</h3>
                  <div className="space-y-3">
                    {[
                      { match: "3rd ODI 2023-24", winner: "IND", indScore: "296/8", saScore: "218", result: "IND Won" },
                      { match: "2nd ODI 2023-24", winner: "SA", indScore: "211", saScore: "215/2", result: "SA Won" },
                      { match: "1st ODI 2023-24", winner: "IND", indScore: "117/2", saScore: "116", result: "IND Won" },
                      { match: "ODI WC 2023", winner: "IND", indScore: "326/5", saScore: "83", result: "IND Won" },
                      { match: "3rd ODI 2022", winner: "IND", indScore: "105/3", saScore: "99", result: "IND Won" }
                    ].map((h2h, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-900/50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{h2h.match}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            IND {h2h.indScore} vs SA {h2h.saScore}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-3 py-1 rounded ${
                            h2h.winner === "IND"
                              ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {h2h.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Playing XI */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* India XI */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">India Playing XI</h3>
                    <div className="space-y-3">
                      {[
                        "Rohit Sharma (c)",
                        "Virat Kohli",
                        "Shubman Gill",
                        "KL Rahul (wk)",
                        "Hardik Pandya",
                        "Ravindra Jadeja",
                        "Axar Patel",
                        "Shardul Thakur",
                        "Kuldeep Yadav",
                        "Jasprit Bumrah",
                        "Mohammed Siraj"
                      ].map((player, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{player}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* South Africa XI */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">South Africa Playing XI</h3>
                    <div className="space-y-3">
                      {[
                        "Temba Bavuma (c)",
                        "Quinton de Kock (wk)",
                        "Rassie van der Dussen",
                        "Aiden Markram",
                        "David Miller",
                        "Heinrich Klaasen",
                        "Marco Jansen",
                        "Keshav Maharaj",
                        "Kagiso Rabada",
                        "Anrich Nortje",
                        "Lungi Ngidi"
                      ].map((player, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{player}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bench Players */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* India Bench */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">India Bench</h3>
                    <div className="space-y-3">
                      {[
                        "Ishan Kishan (wk)",
                        "Suryakumar Yadav",
                        "Washington Sundar",
                        "Yuzvendra Chahal"
                      ].map((player, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{player}</p>
                      ))}
                    </div>
                  </div>
                </div>

                {/* South Africa Bench */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">South Africa Bench</h3>
                    <div className="space-y-3">
                      {[
                        "Reeza Hendricks",
                        "Tristan Stubbs",
                        "Tabraiz Shamsi",
                        "Lizaad Williams"
                      ].map((player, i) => (
                        <p key={i} className="text-sm text-gray-700 dark:text-gray-300">{player}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Officials */}
              <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Match Officials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Umpires</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Nitin Menon, KN Ananthapadmanabhan</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Third Umpire</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Virender Sharma</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Match Referee</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Javagal Srinath</p>
                    </div>
                  </div>
                  </div>
                </div>

                {/* Venue Information */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Venue Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stadium</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Wankhede Stadium</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">City</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Mumbai, India</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Capacity</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">33,108</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pitch</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Good batting surface, expected to assist spinners later</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Series Information */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Series Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Series</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">South Africa tour of India 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Format</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">3 ODI Matches</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">India leads 0-0 (1st Match)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Live Tab */}
            <TabsContent value="live" className="mt-0">
              <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* ========== LEFT COLUMN (Main Content) ========== */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Team Header with Probability - MOBILE/TABLET ONLY */}
                    <div className="bg-[#1a2332] dark:bg-[#0f1419] rounded-lg shadow-lg p-6 lg:hidden">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white">England U19</h2>
                        <div className="flex items-center gap-2">
                          {/* Team Badge */}
                          <div className="bg-blue-100 dark:bg-blue-900/30 px-3 py-2 rounded flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">ENG U19</span>
                            <span className="text-gray-400">✏️</span>
                          </div>
                          {/* Probability Scores */}
                          <div className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-lg">70</div>
                          <div className="bg-red-500 text-white px-4 py-2 rounded font-bold text-lg">79</div>
                        </div>
                      </div>

                      {/* Batters Table */}
                      <div className="mb-6">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">Batter</h3>
                        <table className="w-full">
                          <thead>
                            <tr className="text-gray-400 text-xs">
                              <th className="text-left pb-2"></th>
                              <th className="text-center pb-2">R(B)</th>
                              <th className="text-center pb-2">4S</th>
                              <th className="text-center pb-2">6S</th>
                              <th className="text-center pb-2">SR</th>
                            </tr>
                          </thead>
                          <tbody className="text-white">
                            {/* Batsman 1 */}
                            <tr className="border-t border-gray-700">
                              <td className="py-3 text-sm font-medium">B Dawkins</td>
                              <td className="text-center text-sm">23 (34)</td>
                              <td className="text-center text-sm">1</td>
                              <td className="text-center text-sm">0</td>
                              <td className="text-center text-sm">67.65</td>
                            </tr>
                            {/* Batsman 2 (On Strike) */}
                            <tr className="border-t border-gray-700">
                              <td className="py-3 text-sm font-medium flex items-center gap-1">
                                C Falconer <span className="text-yellow-400 text-xs">⚡</span>
                              </td>
                              <td className="text-center text-sm">24 (31)</td>
                              <td className="text-center text-sm">3</td>
                              <td className="text-center text-sm">0</td>
                              <td className="text-center text-sm">77.42</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Partnership & Last Wicket */}
                      <div className="flex items-center justify-between text-sm text-gray-300 mb-6 pb-4 border-b border-gray-700">
                        <div>
                          <span className="text-gray-400">P'ship:</span> <span className="text-white font-semibold">36(47)</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Last Wkt:</span> <span className="text-white font-semibold">Will Bennison 8(15)</span>
                        </div>
                      </div>

                      {/* Bowler Stats */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">Bowler</h3>
                        <table className="w-full">
                          <thead>
                            <tr className="text-gray-400 text-xs">
                              <th className="text-left pb-2"></th>
                              <th className="text-center pb-2">W-R</th>
                              <th className="text-center pb-2">Overs</th>
                              <th className="text-center pb-2">Econ</th>
                            </tr>
                          </thead>
                          <tbody className="text-white">
                            <tr className="border-t border-gray-700">
                              <td className="py-3 text-sm font-medium">J Van Lange</td>
                              <td className="text-center text-sm">0-20</td>
                              <td className="text-center text-sm">3.3</td>
                              <td className="text-center text-sm">5.71</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* LARGE SCREENS – Card View (CREX Style) - Hidden on mobile */}
                    <div className="hidden lg:block">
                      <div className="bg-[#1a2332] dark:bg-[#0f1419] rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-bold text-white mb-4">Live Match View</h3>
                        
                        {/* Players Row */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {/* Batsman 1 */}
                          <div className="flex items-center gap-3 bg-[#15202b] p-4 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">👤</div>
                            <div>
                              <h4 className="text-white text-sm font-semibold flex items-center gap-1">
                                B Dawkins <span className="text-blue-400">+</span>
                              </h4>
                              <p className="text-white text-2xl font-bold">10 <span className="text-gray-400 text-sm">(15)</span></p>
                            </div>
                          </div>

                          {/* Batsman 2 - On Strike */}
                          <div className="flex items-center gap-3 bg-[#15202b] p-4 rounded-lg ring-2 ring-yellow-500">
                            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl">👤</div>
                            <div>
                              <h4 className="text-white text-sm font-semibold flex items-center gap-1">
                                W Bennison <span className="text-yellow-400">⚡</span>
                              </h4>
                              <p className="text-white text-2xl font-bold">8 <span className="text-gray-400 text-sm">(12)</span></p>
                            </div>
                          </div>

                          {/* Bowler */}
                          <div className="flex items-center gap-3 bg-[#15202b] p-4 rounded-lg">
                            <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">🎳</div>
                            <div>
                              <h4 className="text-white text-sm font-semibold">A Racha</h4>
                              <p className="text-white text-2xl font-bold">2-12 <span className="text-gray-400 text-sm">(2.4)</span></p>
                            </div>
                          </div>
                        </div>

                        {/* Partnership + Last Wicket */}
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-gray-300">
                            <span className="text-blue-400 font-semibold">P'ship:</span> <span className="text-white">17</span>
                            <span className="text-gray-400">(22)</span>
                          </div>
                          <div className="text-gray-300">
                            <span className="text-gray-400">Last Wkt:</span> 
                            <span className="text-blue-400 ml-1 font-medium">Ben Mayes</span>
                            <span className="text-white ml-1">0</span><span className="text-gray-400">(4)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ball Tracker */}
                    <div className="bg-[#1a2332] dark:bg-[#0f1419] rounded-lg shadow-lg p-6">
                      <div className="overflow-x-auto no-scrollbar">
                        <div className="flex space-x-6 min-w-max">
                          {/* Over 5 */}
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium w-16 text-sm">Over 5</span>
                            <div className="flex gap-2">
                              {["1","0","0","2","0","0"].map((r,i)=>(
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                                  {r}
                                </div>
                              ))}
                            </div>
                            <span className="text-gray-400 font-semibold text-sm">= 3</span>
                          </div>

                          {/* Over 6 */}
                          <div className="flex items-center gap-3">
                            <span className="text-white font-medium w-16 text-sm">Over 6</span>
                            <div className="flex gap-2">
                              {["2","0","1","0"].map((r,i)=>(
                                <div key={i} className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white text-xs font-semibold">
                                  {r}
                                </div>
                              ))}
                              <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-dashed"></div>
                              <div className="w-8 h-8 rounded-full border-2 border-gray-700 border-dashed"></div>
                            </div>
                            <span className="text-gray-400 font-semibold text-sm">= 3</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Commentary */}
                    <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow p-6">
                      <h3 className="text-lg font-bold dark:text-white mb-4">Commentary</h3>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {["All","Highlights","Overs","W","6s","4s","Inn 1","Inn 2","Milestone"].map((x,i)=>(
                          <button key={i} className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${i===0 ? "bg-blue-600 text-white" : "bg-gray-200 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"}`}>
                            {x}
                          </button>
                        ))}
                      </div>

                      <div className="space-y-4">
                        {[["6.4","0","Dot ball"],["6.3","1","Quick single"],["6.2","0","Defended"],["6.1","2","Pushed for two"]].map(([ov,run,text],i)=>(
                          <div key={i} className="border-l-4 border-blue-600 pl-4 py-2">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded font-semibold">{ov}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">J Van Lange to Batter</span>
                              <span className="ml-auto font-bold text-gray-900 dark:text-white">{run}</span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ========== RIGHT COLUMN (Sidebar) ========== */}
                  <div className="space-y-6">
                    
                    {/* Probability / Odds View */}
                    <div className="bg-[#1a2332] dark:bg-[#0f1419] rounded-lg shadow p-4 md:p-6">
                      <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Win Probability</h3>

                      {/* Toggle Buttons */}
                      <div className="flex gap-2 mb-4">
                        <button 
                          onClick={() => setViewMode("probability")}
                          className={`px-3 md:px-4 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${
                            viewMode === "probability" 
                              ? "bg-blue-600 text-white" 
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          % View
                        </button>
                        <button 
                          onClick={() => setViewMode("odds")}
                          className={`px-3 md:px-4 py-1.5 rounded text-xs md:text-sm font-medium transition-colors ${
                            viewMode === "odds" 
                              ? "bg-blue-600 text-white" 
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          Odds View
                        </button>
                      </div>

                      {/* % View Content */}
                      {viewMode === "probability" && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-white text-sm md:text-base">England U19</span>  
                          <span className="bg-blue-500 text-white px-3 py-1.5 rounded font-bold text-sm md:text-base">70%</span>
                          <span className="bg-red-500 text-white px-3 py-1.5 rounded font-bold text-sm md:text-base">30%</span>
                        </div>
                      )}

                      {/* Odds View Content */}
                      {viewMode === "odds" && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm md:text-base">England U19</span>
                            <div className="flex gap-2">
                              <span className="bg-blue-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded font-bold text-xs md:text-sm">1.43</span>
                              <span className="bg-red-500 text-white px-2 md:px-3 py-1 md:py-1.5 rounded font-bold text-xs md:text-sm">3.33</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Projected Score */}
                    <div className="bg-[#1a2332] dark:bg-[#0f1419] rounded-lg shadow p-4 md:p-6">
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <h3 className="text-base md:text-lg font-bold text-white">Projected Score</h3>
                        <span className="text-[10px] md:text-xs text-gray-400">as per RR</span>
                      </div>

                      <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                        <table className="w-full text-white text-xs md:text-sm min-w-[320px]">
                          <thead>
                            <tr className="text-gray-400 text-[10px] md:text-xs border-b border-gray-700">
                              <th className="text-left pb-2 pr-2 font-semibold">Run Rate</th>
                              <th className="text-center pb-2 px-1 md:px-2 font-semibold">3.93*</th>
                              <th className="text-center pb-2 px-1 md:px-2 font-semibold">3.75</th>
                              <th className="text-center pb-2 px-1 md:px-2 font-semibold">4.00</th>
                              <th className="text-center pb-2 px-1 md:px-2 font-semibold">4.33</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-700">
                              <td className="py-2 md:py-3 pr-2 text-xs md:text-sm font-medium">20 Overs</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">78</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">77</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">79</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">80</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-2 md:py-3 pr-2 text-xs md:text-sm font-medium">30 Overs</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">117</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">115</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">119</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">124</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                              <td className="py-2 md:py-3 pr-2 text-xs md:text-sm font-medium">40 Overs</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">157</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">152</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">158</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">165</td>
                            </tr>
                            <tr>
                              <td className="py-2 md:py-3 pr-2 text-xs md:text-sm font-medium">50 Overs</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">196</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">189</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">198</td>
                              <td className="text-center text-xs md:text-sm px-1 md:px-2">207</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </TabsContent>


            {/* Scorecard Tab */}
            <TabsContent value="scorecard" className="mt-0">
              <div className="max-w-7xl mx-auto">
                
                {/* Innings Selector Tabs */}
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm mb-6 overflow-hidden">
                  <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-800">
                    {[
                      { id: 'ind-1st', label: 'India 1st Innings', score: '245/10 (50 Ov)' },
                      { id: 'sa-1st', label: 'South Africa 1st Innings', score: '64/1 (8.2 Ov)' },
                      { id: 'ind-2nd', label: 'India 2nd Innings', score: 'Yet to bat' },
                      { id: 'sa-2nd', label: 'South Africa 2nd Innings', score: 'Yet to bat' }
                    ].map((innings) => (
                      <button
                        key={innings.id}
                        onClick={() => setActiveInnings(innings.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                          activeInnings === innings.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                        }`}
                      >
                        <div className="text-left">
                          <div className="font-semibold">{innings.label}</div>
                          <div className={`text-xs ${activeInnings === innings.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                            {innings.score}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                  
                  {/* Current Innings Header */}
                  <div className="px-6 py-4">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {activeInnings === 'ind-1st' && 'India 1st Innings - 245/10 (50 Ov)'}
                      {activeInnings === 'sa-1st' && 'South Africa 1st Innings - 64/1 (8.2 Ov)'}
                      {activeInnings === 'ind-2nd' && 'India 2nd Innings - Yet to bat'}
                      {activeInnings === 'sa-2nd' && 'South Africa 2nd Innings - Yet to bat'}
                    </h3>
                  </div>
                </div>

                {/* 2-Column Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* LEFT COLUMN - Main Stats */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Batting Table */}
                    <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 dark:text-white">Batting</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Batsman</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">R</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">B</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">4s</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">6s</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">SR</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">Rohit Sharma *</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">batting</p>
                                </div>
                              </td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">12</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">13</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">1</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">1</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">92.31</td>
                            </tr>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">Virat Kohli *</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">batting</p>
                                </div>
                              </td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">23</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">21</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">3</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">109.52</td>
                            </tr>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-900 dark:text-white">Shubman Gill</p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">c de Kock b Rabada</p>
                                </div>
                              </td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">15</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">12</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">2</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">125.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      
                      {/* Extras & Total */}
                      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Extras</span>
                          <span className="font-medium text-gray-900 dark:text-white">14 (b 4, lb 2, w 6, nb 2)</span>
                        </div>
                        <div className="flex justify-between text-base font-bold">
                          <span className="text-gray-900 dark:text-white">Total</span>
                          <span className="text-gray-900 dark:text-white">64/1 (8.2 Ov)</span>
                        </div>
                      </div>
                    </div>

                    {/* Bowling Table */}
                    <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 dark:text-white">Bowling</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Bowler</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">O</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">M</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">R</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">W</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Econ</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Kagiso Rabada</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">4</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">28</td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">1</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">7.00</td>
                            </tr>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">Lungi Ngidi</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">4.2</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">36</td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">0</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">8.31</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Fall of Wickets */}
                    <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm px-6 py-4">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-3">Fall of Wickets</h4>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">1st Wicket</span>
                          <span className="font-medium text-gray-900 dark:text-white">39 runs (Shubman Gill, 7.5 ov)</span>
                        </div>
                      </div>
                    </div>

                    {/* Partnerships */}
                    <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
                        <h4 className="font-bold text-gray-900 dark:text-white">Partnerships</h4>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
                              <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Partnership</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Runs</th>
                              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Balls</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Rohit Sharma & Shubman Gill</td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">39</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">45</td>
                            </tr>
                            <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                              <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">Rohit Sharma & Virat Kohli *</td>
                              <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">25</td>
                              <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">20</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN - Yet to Bat */}
                  <div>
                    <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm p-6 sticky top-6">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">Yet to Bat</h4>
                      <div className="space-y-2">
                        {[
                          "KL Rahul",
                          "Hardik Pandya",
                          "Ravindra Jadeja",
                          "Axar Patel",
                          "Shardul Thakur",
                          "Kuldeep Yadav",
                          "Jasprit Bumrah",
                          "Mohammed Siraj"
                        ].map((player, i) => (
                          <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">
                              {i + 4}
                            </div>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{player}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </TabsContent>

            {/* Points Table Tab */}
            <TabsContent value="points-table" className="mt-0">
              <div className="max-w-5xl mx-auto">
                <div className="bg-white dark:bg-[#0f1419] rounded-lg shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">ODI Series Standings</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50 dark:bg-[#1a1f2e] border-b border-gray-200 dark:border-gray-800">
                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Team</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">P</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">W</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">L</th>
                            <th className="text-center px-4 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">Pts</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">🇮🇳 India</td>
                            <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                            <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                            <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                            <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">0</td>
                          </tr>
                          <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/30">
                            <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">🇿🇦 South Africa</td>
                            <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                            <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                            <td className="text-center px-4 py-4 text-sm text-gray-700 dark:text-gray-300">0</td>
                            <td className="text-center px-4 py-4 text-sm font-bold text-gray-900 dark:text-white">0</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </main>
      </Tabs>

      <Footer />
    </div>
  );
}
