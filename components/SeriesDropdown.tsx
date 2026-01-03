"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface SeriesDropdownProps {
  isOpen: boolean;
}

export function SeriesDropdown({ isOpen }: SeriesDropdownProps) {
  const series = [
    { id: 1, name: "Abu Dhabi T10 2025", image: "https://cricketvectors.akamaized.net/Series/1U1.png?impolicy=default_web" },
    { id: 2, name: "WI vs NZ 2025", image: "https://cricketvectors.akamaized.net/Series/1U2.png?impolicy=default_web" },
    { id: 3, name: "WBBL 2025", image: "https://cricketvectors.akamaized.net/Series/1U3.png?impolicy=default_web" },
    { id: 4, name: "IRE vs BAN 2025", image: "https://cricketvectors.akamaized.net/Series/1U4.png?impolicy=default_web" },
    { id: 5, name: "ILT20 2025-26", image: "https://cricketvectors.akamaized.net/Series/1U5.png?impolicy=default_web" },
    { id: 6, name: "SMAT Elite T20 2025", image: "https://cricketvectors.akamaized.net/Series/1U6.png?impolicy=default_web" },
    { id: 7, name: "SMAT Plate T20 2025", image: "https://cricketvectors.akamaized.net/Series/1U7.png?impolicy=default_web" },
  ];

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 left-0 right-0 w-full bg-white dark:bg-[#0c1524] border-b border-gray-200 dark:border-[#1e2d4a] shadow-lg z-50 transition-colors duration-300">
      <div className="w-full px-4 md:px-[70px] py-4 relative">

        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-6 flex items-center">
            {series.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-auto pl-12 select-none"
              >
                <div className="flex flex-col items-center cursor-pointer group">

                  {/* Poster (110x140px) */}
                  <div className="
                    w-[110px] h-[140px]
                    rounded-lg overflow-hidden 
                    shadow-md 
                    group-hover:scale-105 
                    transition-transform
                    bg-gray-100 dark:bg-[#1a2338]
                  ">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Name */}
                  <p className="text-gray-900 dark:text-red-200 text-[12px] mt-2 text-center w-[110px] truncate transition-colors">
                    {item.name}
                  </p>

                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Left Arrow */}
          <CarouselPrevious
            className="
              absolute left-0 top-1/2 -translate-y-1/2
              bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20
              text-black dark:text-white border-none
              shadow-lg rounded-full w-8 h-8
              flex items-center justify-center
              transition-colors
            "
          />

          {/* Right Arrow */}
          <CarouselNext
            className="
              absolute right-0 top-1/2 -translate-y-1/2
              bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20
              text-black dark:text-white border-none
              shadow-lg rounded-full w-8 h-8
              flex items-center justify-center
              transition-colors
            "
          />
        </Carousel>

      </div>
    </div>
  );
}
