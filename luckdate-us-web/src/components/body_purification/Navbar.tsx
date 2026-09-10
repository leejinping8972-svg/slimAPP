'use client';

import logo from "@/assets/body_purification/logo.png";
import { Trophy } from "lucide-react";
import Link from "next/link";
import { getImageSrc } from "./utils";
import { LazyImg } from './LazyMedia';

interface NavbarProps {
  onShopNow?: () => void;
}

const Navbar = ({ onShopNow }: NavbarProps) => {
  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 flex items-center justify-between h-11 sm:h-14 gap-2">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link href="/" className="flex-shrink-0">
            <LazyImg src={getImageSrc(logo)} alt="LuckDate" className="h-6 sm:h-8" />
          </Link>
          <span className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-xl font-bold text-primary tracking-wide whitespace-nowrap">
            <Trophy className="w-4 h-4 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
            <span className="hidden xs:inline sm:inline">100k+ Sold</span>
            <span className="xs:hidden sm:hidden">100k+ Sold</span>
          </span>
        </div>
        <button
          onClick={onShopNow}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm transition-colors uppercase tracking-wide whitespace-nowrap flex-shrink-0"
        >
          Shop Now
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
