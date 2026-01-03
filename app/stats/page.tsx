"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Trophy,
  Activity,
  Users,
  ChevronRight,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * Stats page (CREX-style)
 * - Hero + title + "Apply Filters" button visible on page
 * - Clicking Apply Filters opens a centered popup containing all filter controls
 * - Popup has 6 dropdowns + search + Apply changes / Close buttons
 * - Dark/light styles compatible with your Tailwind variables
 */

export default function StatsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filters, setFilters] = useState({
    record: "Runs",
    series: "Asia Cup",
    season: "2025",
    team: "All",
    venue: "All",
    format: "T20",
    query: "",
  });

  function updateFilter<K extends keyof typeof filters>(k: K, v: string) {
    setFilters((p) => ({ ...p, [k]: v }));
  }

  return (
    <div className="min-h-screen bg-[#0b0f12] dark:bg-[#0b0f12] flex flex-col">
      <Navbar />

      {/* HERO / HEADER */}
      <header className="relative">
        {/* dark hero background (use image if you want) */}
        <div className="h-56 bg-[url('/images/hero-cricket.jpg')] bg-cover bg-center opacity-95">
          {/* <div className="bg-black/50 h-full w-full"></div> */}
        </div>

        <div className="container mx-auto px-4 -mt-20">
          <div className="bg-transparent">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white">
                  Most Runs in Asia Cup 2025
                </h1>
                <p className="text-sm text-gray-200 mt-2">
                  Explore top performers and filter results using advanced options.
                </p>
              </div>

              {/* APPLY FILTERS BUTTON (opens modal) */}
              <div className="w-full md:w-auto mt-4 md:mt-0">
                <Button
                  className="w-full md:w-auto bg-[#0b74d9] hover:bg-[#0a66c2] text-white px-5 py-3 rounded-lg shadow-lg"
                  onClick={() => setIsFilterOpen(true)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* featured cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-[#1e3a8a] to-[#0ea5a9] text-white overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">Asia Cup 2025</div>
                  <h3 className="text-2xl md:text-3xl font-black mt-2 md:mt-4">Most Runs</h3>
                  <p className="text-sm opacity-90 mt-1">Top run-scorers across the tournament.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-black">314</div>
                  <div className="text-xs opacity-80">Runs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-[#6b21a8] to-[#ef4444] text-white overflow-hidden">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xs bg-white/20 px-3 py-1 rounded-full inline-block">Asia Cup 2025</div>
                  <h3 className="text-2xl md:text-3xl font-black mt-2 md:mt-4">Most Wickets</h3>
                  <p className="text-sm opacity-90 mt-1">Top wicket takers across the tournament.</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-black">21</div>
                  <div className="text-xs opacity-80">Wickets</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABLE / LIST AREA (placeholder) */}
        <section className="bg-white dark:bg-[#081023] rounded-2xl border border-gray-200 dark:border-[#1f2a3a] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4 md:gap-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top Players</h2>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-[260px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search player..."
                  value={filters.query}
                  onChange={(e) => updateFilter("query", e.target.value)}
                  className="pl-10 h-10 rounded-lg bg-gray-50 dark:bg-[#071025] border border-gray-200 dark:border-[#152032] w-full"
                />
              </div>
            </div>
          </div>

          {/* placeholder table rows to mimic screenshot */}
          <div className="divide-y divide-gray-100 dark:divide-[#13202b]">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-[#04202a] flex items-center justify-center overflow-hidden">
                    <img
                      src={`https://i.pravatar.cc/64?img=${i + 10}`}
                      alt="player"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">Player Name {i + 1}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Team • Matches</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-gray-900 dark:text-white">314</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Runs</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* ------------------------ FILTER MODAL (CENTERED POPUP) ------------------------ */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-start md:items-center justify-center p-6">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />

          {/* modal card */}
          <div className="relative z-60 w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-[#071226] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#153040]">
            <div className="p-5 border-b border-gray-100 dark:border-[#122b3a] flex items-center justify-between shrink-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filter Records</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-[#06202c]"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Record dropdown */}
                <PopupDropdown
                  label="Most"
                  value={filters.record}
                  options={["Runs", "Wickets", "Fifties", "Hundreds", "Sixes", "Fours", "Highest Strike Rate"]}
                  onChange={(v) => updateFilter("record", v)}
                />

                <PopupDropdown
                  label="In"
                  value={filters.series}
                  options={["Asia Cup", "IPL", "World Cup", "Bilateral Series"]}
                  onChange={(v) => updateFilter("series", v)}
                />

                <PopupDropdown
                  label="Season"
                  value={filters.season}
                  options={["2023", "2024", "2025"]}
                  onChange={(v) => updateFilter("season", v)}
                />

                <PopupDropdown
                  label="Playing For"
                  value={filters.team}
                  options={["All", "IND", "PAK", "SL", "BAN", "AUS"]}
                  onChange={(v) => updateFilter("team", v)}
                />

                <PopupDropdown
                  label="At Venue"
                  value={filters.venue}
                  options={["All", "Dubai", "Sharjah", "Colombo", "Mumbai"]}
                  onChange={(v) => updateFilter("venue", v)}
                />

                <PopupDropdown
                  label="In Format"
                  value={filters.format}
                  options={["T20", "ODI", "Test"]}
                  onChange={(v) => updateFilter("format", v)}
                />
              </div>

              {/* search inside modal */}
              <div className="px-6 pb-6">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search record"
                    value={filters.query}
                    onChange={(e) => updateFilter("query", e.target.value)}
                    className="pl-10 h-10 rounded-lg bg-gray-50 dark:bg-[#042230] border border-gray-200 dark:border-[#12303c]"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-[#122b3a] flex items-center justify-end gap-3 shrink-0">
              <Button
                variant="ghost"
                className="px-5 py-2 rounded-lg"
                onClick={() => setIsFilterOpen(false)}
              >
                Close
              </Button>
              <Button
                className="px-6 py-2 rounded-lg bg-[#0b74d9] hover:bg-[#0a66c2] text-white"
                onClick={() => {
                  // Apply changes (here you would call API / update state)
                  setIsFilterOpen(false);
                }}
              >
                Apply changes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------------- Helper: PopupDropdown ---------------------- */

function PopupDropdown({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{label}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 dark:border-[#12303c] bg-gray-50 dark:bg-[#061a25] flex items-center justify-between">
            <span className="font-semibold text-gray-800 dark:text-gray-100">{value}</span>
            <ChevronRight className="w-4 h-4 opacity-60" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          {options.map((opt) => (
            <DropdownMenuItem
              key={opt}
              onClick={() => onChange(opt)}
              className="px-4 py-2 cursor-pointer"
            >
              {opt}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
