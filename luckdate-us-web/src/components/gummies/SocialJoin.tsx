'use client';

import { Facebook, Users } from 'lucide-react';

export default function SocialJoin() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-r from-deep-rose to-[#FF8FA3] text-white">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
              <Users className="w-4 h-4" />
              <span className="text-sm font-body font-medium">Join our community</span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold mb-6 leading-tight">
              Join the Women Who Choose{' '}
              <span className="font-bold underline decoration-wavy decoration-white/40">Confidence</span>{' '}
              Every Day.
            </h2>

            <p className="text-lg md:text-xl font-body text-white/90 mb-8 max-w-xl">
              Get wellness tips, exclusive offers, and support from a growing community that
              prioritizes feminine health.
            </p>

            <a
              href="https://www.facebook.com/61578516483029"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white text-deep-rose px-8 py-4 rounded-full font-body text-lg font-bold hover:shadow-soft-xl hover:scale-105 transition-all duration-300"
            >
              <Facebook className="w-6 h-6" />
              Follow on Facebook
            </a>
          </div>

          <div className="relative hidden lg:block">
            <div className="w-64 h-64 bg-white/10 rounded-full flex items-center justify-center p-8 backdrop-blur-md border border-white/20">
              <div className="text-center">
                <div className="text-4xl font-heading font-bold mb-2">💪</div>
                <div className="text-sm font-body uppercase tracking-widest opacity-80">
                  Empowered Women
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-white/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-2xl animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
