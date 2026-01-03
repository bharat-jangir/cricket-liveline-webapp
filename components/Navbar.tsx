"use client";

// Mobile responsive navbar implementation

import { cn } from "@/lib/utils";
import Link from "next/link";
import { Sun, Moon, ChevronDown, ChevronUp, Home, Calendar, BarChart2, Trophy, Menu } from "lucide-react";
import { useState, useEffect } from "react";
import { SeriesDropdown } from "./SeriesDropdown";

export function Navbar() {
  const [isDark, setIsDark] = useState(true);
  const [seriesOpen, setSeriesOpen] = useState(false);

    useEffect(() => {
      document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

  return (
    <div className="relative sticky top-0 z-50">
      <nav className="bg-white dark:bg-[#0c1220] border-b border-gray-200 dark:border-[#1a2338] sticky top-0 z-50 h-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-full px-6">


         <div className="flex flex-[0.3] justify-center items-center">
          {/* Left - Logo */}
          <Link href="/" className="flex items-center -ml-1">
            <span className="text-gray-900 dark:text-white font-black text-2xl tracking-tighter select-none transition-colors">
              Cricket
            </span>
          </Link>
         </div>

          {/* Right - Navigation Links + Theme Toggle (Desktop Only) */}
          <div className="hidden md:flex flex-[0.7] items-center justify-center gap-6">

            <Link 
              href="/" 
              className="text-gray-900 dark:text-white font-semibold text-sm hover:text-black/80 dark:hover:text-white/80 transition-colors p-[20px]"
            >
              Home
            </Link>

            <div className="flex items-center gap-1 p-[20px]">
              <span
               onClick={() => setSeriesOpen(!seriesOpen)}
               className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-black dark:hover:text-white transition-colors cursor-pointer"
              >
                Series
              </span>
              <span className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                {seriesOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </div>

            <Link href="/fixtures" className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-black dark:hover:text-white transition-colors p-[20px]">
              Fixtures
            </Link>

            <Link href="/stats" className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-black dark:hover:text-white transition-colors p-[20px]">
              Stats Corner
            </Link>

            <Link href="/rankings" className="text-gray-600 dark:text-gray-400 text-sm font-medium hover:text-black dark:hover:text-white transition-colors p-[20px]">
              Rankings
            </Link>

            {/* Theme Toggle - Rightmost */}
            <span
              onClick={() => setIsDark(!isDark)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors p-[20px] cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4" />  : <Moon className="w-4 h-4" />}
              {isDark?"Bright": "Dark"}
            </span>

          </div>
        </div>
      </nav>
      
      {/* Series Dropdown - Shows below navbar */}
      <SeriesDropdown isOpen={seriesOpen} />

      {/* Bottom Tab Bar (Mobile Only) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-[#0c1220] border-t border-gray-200 dark:border-[#1a2338] z-50 px-4 py-2 flex justify-between items-center safe-area-bottom">
        <Link href="/" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <div 
          onClick={() => setSeriesOpen(!seriesOpen)}
          className={cn(
            "flex flex-col items-center gap-1 cursor-pointer",
            seriesOpen ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"
          )}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-medium">Series</span>
        </div>

        <Link href="/fixtures" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-medium">Fixtures</span>
        </Link>

        <Link href="/stats" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] font-medium">Stats</span>
        </Link>

        <Link href="/rankings" className="flex flex-col items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <Trophy className="w-5 h-5" />
          <span className="text-[10px] font-medium">Rankings</span>
        </Link>

        <div 
          onClick={() => setIsDark(!isDark)}
          className="flex flex-col items-center gap-1 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          <span className="text-[10px] font-medium">{isDark ? "Light" : "Dark"}</span>
        </div>
      </div>
    </div>
  );
}