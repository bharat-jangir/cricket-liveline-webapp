"use client";

import { useState, useMemo, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Trophy,
} from "lucide-react";

/**
 * Fixtures Page (CREX style)
 * - Days tab UI implemented (full match list view)
 * - Date strip with arrows and horizontal scroll
 * - Fixed-size flags / posters, centered time column, separators
 *
 * Paste into your Next / React app and it should render like the screenshot.
 */

type Match = {
  id: string;
  startTime: string;
  timeLabel: string; // e.g. "6:40 AM", "Today"
  venue: string;
  info: string; // e.g. "Qualifier 1"
  t1: string;
  t1Flag?: string;
  t1Score?: string;
  t2: string;
  t2Flag?: string;
  t2Score?: string;
  status?: string;
  live?: boolean;
};

const sampleFixturesByDate: Record<string, Match[]> = {
  "2025-11-29": [
    {
      id: "m1",
      startTime: "10:30",
      timeLabel: "10:30 AM",
      venue: "Abu Dhabi T10 2025",
      info: "Qualifier 1",
      t1: "QQY",
      t1Flag: "https://cricketvectors.akamaized.net/Teams/1QQ.png?impolicy=default_web",
      t1Score: "102/6 (10.0)",
      t2: "AST",
      t2Flag: "https://cricketvectors.akamaized.net/Teams/1AST.png?impolicy=default_web",
      t2Score: "103/3 (8.5)",
      status: "AST Won",
      live: false,
    },
    {
      id: "m2",
      startTime: "14:00",
      timeLabel: "2:00 PM",
      venue: "Abu Dhabi T10 2025",
      info: "Eliminator 1",
      t1: "AT",
      t1Flag: "https://cricketvectors.akamaized.net/Teams/1AT.png?impolicy=default_web",
      t1Score: "115/4 (10.0)",
      t2: "UAB",
      t2Flag: "https://cricketvectors.akamaized.net/Teams/1UAB.png?impolicy=default_web",
      t2Score: "162/3 (10.0)",
      status: "UAB Won",
      live: false,
    },
    {
      id: "m3",
      startTime: "17:00",
      timeLabel: "Live",
      venue: "Abu Dhabi T10 2025",
      info: "Group Stage",
      t1: "TNT",
      t1Flag: "https://cricketvectors.akamaized.net/Teams/1TNT.png?impolicy=default_web",
      t1Score: "69/2 (16.0)",
      t2: "BAR",
      t2Flag: "https://cricketvectors.akamaized.net/Teams/1BAR.png?impolicy=default_web",
      t2Score: "",
      status: "Live",
      live: true,
    },
  ],
  "2025-11-30": [
    {
      id: "m4",
      startTime: "06:40",
      timeLabel: "6:40 AM",
      venue: "30th T20, WBBL 2025",
      info: "Brisbane Heat Women vs Adelaide Strikers Women",
      t1: "Brisbane Heat Women",
      t1Flag:
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Brisbane_Heat_logo.svg/1200px-Brisbane_Heat_logo.svg.png",
      t1Score: "",
      t2: "Adelaide Strikers Women",
      t2Flag:
        "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Adelaide_Strikers_logo.svg/1200px-Adelaide_Strikers_logo.svg.png",
      t2Score: "",
      status: "Upcoming",
      live: false,
    },
    {
      id: "m5",
      startTime: "07:30",
      timeLabel: "7:30 AM",
      venue: "SEAT20 2025",
      info: "Bahrain vs Thailand",
      t1: "Bahrain",
      t1Flag: "https://flagcdn.com/w80/bh.png",
      t1Score: "",
      t2: "Thailand",
      t2Flag: "https://flagcdn.com/w80/th.png",
      t2Score: "",
      status: "Upcoming",
      live: false,
    },
    {
      id: "m6",
      startTime: "08:00",
      timeLabel: "8:00 AM",
      venue: "W-Emerging Trophy 2025",
      info: "Netherlands Women vs Uganda Women",
      t1: "Netherlands Women",
      t1Flag: "https://flagcdn.com/w80/nl.png",
      t1Score: "",
      t2: "Uganda Women",
      t2Flag: "https://flagcdn.com/w80/ug.png",
      t2Score: "",
      status: "Upcoming",
      live: false,
    },
  ],
};

function formatDateHeader(dateIso: string) {
  const d = new Date(dateIso);
  const options: Intl.DateTimeFormatOptions = { weekday: "short", day: "numeric", month: "short", year: "numeric" };
  return d.toLocaleDateString(undefined, options);
}

export default function FixturesPage() {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [mainTab, setMainTab] = useState<"Days" | "Series" | "Teams">("Days");
  const [activeFilter, setActiveFilter] = useState("International");

  // date strip (build from keys)
  const dateKeys = useMemo(() => Object.keys(sampleFixturesByDate), []);



  return (
    <div className="min-h-screen bg-[#f4f5f7] dark:bg-[#090c0f] flex flex-col transition-colors duration-300 font-sans">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 md:px-8 py-8">
        {/* Top controls (Days | Series | Teams) */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-3 mb-6">
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
             <div className="flex items-center gap-1 bg-white dark:bg-[#161b23] p-1 rounded-xl w-fit border border-gray-200 dark:border-[#252a33] shadow-sm whitespace-nowrap">
            {["Days", "Series", "Teams"].map((tab) => (
              <button
                key={tab}
                onClick={() => setMainTab(tab as any)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                  mainTab === tab ? "bg-[#3b96ff] text-white shadow-md" : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#1a2338]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          </div>

          {/* sub filters */}
          <div className="w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex items-center gap-2 md:ml-4 whitespace-nowrap">
            {["International", "T20 Leagues", "Domestic", "Women"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === f
                    ? "bg-black dark:bg-white text-white dark:text-black shadow-sm"
                    : "bg-white dark:bg-[#161b23] text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-[#252a33] hover:bg-gray-50 dark:hover:bg-[#1a2338]"
                }`}
              >
                {f}
              </button>
            ))}
            </div>
          </div>

          <div className="ml-auto flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full h-9 w-9 bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33] md:hidden"
              onClick={() => setShowMobileFilters(true)}
            >
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33] hidden md:flex">
              <Filter className="w-4 h-4 text-gray-500" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full h-9 w-9 bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33]">
              <Calendar className="w-4 h-4 text-gray-500" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left content - fixtures list */}
          <div className="col-span-12 lg:col-span-8">


            {/* Fixtures grouped by date */}
            <div className="space-y-6">
              {dateKeys.map((dateIso) => {
                const matches = sampleFixturesByDate[dateIso];
                if (!matches || matches.length === 0) return null;
                return (
                  <section key={dateIso} className="bg-transparent">
                    <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                      {formatDateHeader(dateIso)}
                    </h4>

                    <div className="space-y-4 md:space-y-2">
                      {matches.map((match, idx) => (
                        <div key={match.id} className="p-4 flex flex-col md:flex-row items-center gap-4 md:gap-6 bg-white dark:bg-[#161b23] rounded-xl shadow-sm border border-gray-200 dark:border-[#252a33]">
                          
                          {/* Mobile Header: Venue & Status */}
                          <div className="md:hidden w-full flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-2 mb-1">
                             <span className="text-[10px] text-gray-500 uppercase tracking-wide truncate max-w-[60%]">{match.venue}</span>
                             <span className={`text-[10px] font-bold ${match.live ? "text-[#ff3b30]" : "text-blue-600"}`}>
                                {match.live ? "LIVE" : match.status || match.timeLabel}
                             </span>
                          </div>

                          {/* Left: Team 1 */}
                          <div className="w-full md:flex-1 flex items-center justify-between md:justify-start gap-4">
                            <div className="flex items-center gap-3">
                              {/* small flag */}
                              <img
                                src={match.t1Flag || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.t1)}&size=64`}
                                alt={match.t1}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.t1)}&size=64`; }}
                              />
                              <div className="flex flex-col">
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{match.t1}</div>
                                <div className="md:hidden text-xs font-bold text-gray-900 dark:text-white mt-0.5">{match.t1Score}</div>
                                <div className="hidden md:block text-xs text-gray-500 dark:text-gray-400">{match.t1Score}</div>
                              </div>
                            </div>
                            {/* Mobile Score (Right aligned in team row if needed, but here stacked) */}
                          </div>

                          {/* Center: Time & series/venue (Desktop Only) */}
                          <div className="hidden md:flex w-56 text-center flex-col items-center gap-2">
                            <div className="text-sm font-semibold text-gray-800 dark:text-white">
                              {match.live ? <span className="text-[#ff3b30]">● </span> : null}
                              <span className={`${match.live ? "text-[#3b96ff]" : "text-gray-700 dark:text-gray-300"}`}>{match.status || match.timeLabel}</span>
                            </div>
                            <div className="text-[11px] text-gray-400 dark:text-gray-500">{match.venue}</div>
                          </div>

                          {/* Right: Team 2 */}
                          <div className="w-full md:flex-1 flex items-center justify-between md:justify-end gap-4">
                            
                            {/* Desktop Layout for Team 2 */}
                            <div className="hidden md:block text-right mr-2">
                              <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{match.t2}</div>
                              <div className="text-xs text-gray-500 dark:text-gray-400">{match.t2Score}</div>
                            </div>
                            <img
                              src={match.t2Flag || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.t2)}&size=64`}
                              alt={match.t2}
                              className="hidden md:block w-8 h-8 rounded-full object-cover"
                              onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.t2)}&size=64`; }}
                            />

                            {/* Mobile Layout for Team 2 */}
                            <div className="md:hidden flex items-center gap-3 w-full">
                               <img
                                src={match.t2Flag || `https://ui-avatars.com/api/?name=${encodeURIComponent(match.t2)}&size=64`}
                                alt={match.t2}
                                className="w-8 h-8 rounded-full object-cover"
                                onError={(e) => { (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(match.t2)}&size=64`; }}
                              />
                              <div className="flex flex-col">
                                <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{match.t2}</div>
                                <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{match.t2Score}</div>
                              </div>
                            </div>

                          </div>
                          
                          {/* Mobile Footer: Match Info (if needed extra) */}
                          <div className="md:hidden w-full text-xs text-gray-400 mt-1 truncate">
                             {match.info}
                          </div>

                        </div>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* Right: Filters / Sidebar */}
          <aside className="col-span-12 lg:col-span-4 hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <Card className="bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33]">
                <CardContent className="p-4">
                  <h5 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">Filter Fixtures</h5>

                  <div className="space-y-3">
                    <label className="block text-xs text-gray-500">Team</label>
                    <select className="w-full rounded-md border border-gray-200 dark:border-[#252a33] bg-white dark:bg-[#0c1220] px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      <option>All Teams</option>
                      <option>India</option>
                      <option>Australia</option>
                    </select>

                    <label className="block text-xs text-gray-500">Format</label>
                    <select className="w-full rounded-md border border-gray-200 dark:border-[#252a33] bg-white dark:bg-[#0c1220] px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      <option>All Formats</option>
                      <option>T20</option>
                      <option>ODI</option>
                    </select>

                    <label className="block text-xs text-gray-500">Series Type</label>
                    <select className="w-full rounded-md border border-gray-200 dark:border-[#252a33] bg-white dark:bg-[#0c1220] px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                      <option>All Series</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-[#161b23] border-gray-200 dark:border-[#252a33]">
                <CardContent className="p-4">
                  <h5 className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-2">Quick Actions</h5>
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start">My Followed Teams</Button>
                    <Button variant="ghost" className="justify-start">Upcoming TV</Button>
                    <Button variant="ghost" className="justify-start">Live Matches</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </main>

      <Footer />

      {/* Mobile Filter Popup Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-end md:hidden">
          <div className="w-full bg-white dark:bg-[#161b23] rounded-t-2xl p-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Close
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Team</label>
                <select className="w-full rounded-md border border-gray-200 dark:border-[#252a33] bg-white dark:bg-[#0c1220] px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200">
                  <option>All Teams</option>
                  <option>India</option>
                  <option>Australia</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Format</label>
                <select className="w-full rounded-md border border-gray-200 dark:border-[#252a33] bg-white dark:bg-[#0c1220] px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200">
                  <option>All Formats</option>
                  <option>T20</option>
                  <option>ODI</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1.5">Series Type</label>
                <select className="w-full rounded-md border border-gray-200 dark:border-[#252a33] bg-white dark:bg-[#0c1220] px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200">
                  <option>All Series</option>
                </select>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full bg-[#3b96ff] hover:bg-[#3b96ff]/90 text-white"
                  onClick={() => setShowMobileFilters(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
