import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-12 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
              <span className="text-black font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold text-white">CREX</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-white transition-colors">About</Link>
            <Link href="#" className="hover:text-white transition-colors">Grievance</Link>
            <Link href="#" className="hover:text-white transition-colors">Refund Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms and Conditions</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact Us</Link>
          </div>

          <div className="text-xs text-muted-foreground">
            © 2025 CREX. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
