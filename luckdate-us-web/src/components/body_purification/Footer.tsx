'use client';

import logo from "@/assets/body_purification/logo.png";
import { getImageSrc } from "./utils";
import { LazyImg } from './LazyMedia';

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-8 pb-24 sm:pb-28">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <LazyImg src={getImageSrc(logo)} alt="LuckDate" className="h-10 mx-auto mb-5" />
        <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
          These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
        <p className="text-sm text-muted-foreground">© 2026 LuckDate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
