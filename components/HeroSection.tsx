import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative rounded-2xl overflow-hidden bg-card border border-border group cursor-pointer">
      <div className="grid md:grid-cols-2 gap-0">
        
        {/* Image Side */}
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 md:hidden" />
          <img 
            src="https://img1.hscicdn.com/image/upload/f_auto,t_ds_w_1280,q_80/lsci/db/PICTURES/CMS/396500/396537.jpg" 
            alt="Featured News" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Content Side */}
        <div className="relative p-6 md:p-10 flex flex-col justify-center bg-white dark:bg-[#161b23]">
          <div className="space-y-4">
            <Badge className="w-fit bg-red-500 hover:bg-red-600 text-white border-0">
              Top Story
            </Badge>
            
            <h1 className="text-2xl md:text-4xl font-black leading-tight text-gray-900 dark:text-white">
              India's Dominance Continues: A Historic Series Win Down Under
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base line-clamp-3">
              In a thrilling finale at the MCG, India secured a monumental victory against Australia, sealing the series 3-1. Virat Kohli's masterclass century and Bumrah's fiery spell were the highlights of the day.
            </p>

            <div className="pt-4">
              <Button variant="outline" className="group/btn border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white">
                Read Full Story
                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
