'use client';

import { Smartphone, Bell, LineChart, Sparkles } from 'lucide-react';
import SlimReveal from './SlimReveal';

const features = [
  { icon: Sparkles, label: 'Personalized Plan' },
  { icon: Bell, label: 'Daily Reminders' },
  { icon: LineChart, label: 'Track & Improve' },
  { icon: Smartphone, label: 'AI Companion Sunny' },
];

export default function SlimApp() {
  return (
    <section id="app" className="py-14 md:py-20 bg-[#EEF4EF]">
      <div className="max-w-[1120px] mx-auto px-5 lg:px-8">
        <SlimReveal className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-[2.5rem] font-medium text-[#2C322E] leading-tight">
            Already have your Slim?
            <br />
            Connect it in the App &amp; start your journey.
          </h2>
        </SlimReveal>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 items-center">
          {/* QR + stores */}
          <SlimReveal className="flex flex-col items-center text-center order-2 lg:order-1">
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-[#2A4035]/8 mb-4">
              <div className="w-36 h-36 bg-[#2A4035] rounded-xl grid grid-cols-5 gap-1 p-3">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span
                    key={i}
                    className={`rounded-[1px] ${
                      [0, 1, 2, 4, 5, 6, 8, 10, 12, 14, 16, 18, 19, 20, 22, 23, 24].includes(i)
                        ? 'bg-white'
                        : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#6C6763] mb-4">Scan to download &amp; activate</p>
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-[240px]">
              <a
                href="https://apps.apple.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-[#2A4035] text-white px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-[#1E2F27]"
              >
                App Store
              </a>
              <a
                href="https://play.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border border-[#2A4035]/35 text-[#2A4035] px-4 py-2.5 rounded-xl text-xs font-semibold hover:bg-white"
              >
                Google Play
              </a>
            </div>
          </SlimReveal>

          {/* Phone */}
          <SlimReveal delay={80} className="flex justify-center order-1 lg:order-2">
            <div className="w-[220px] sm:w-[240px] rounded-[2rem] border-[5px] border-[#2A4035]/15 bg-gradient-to-b from-[#3D5A4A] to-[#1E2F27] text-white p-4 shadow-soft-xl aspect-[9/17] flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-white/45">Sunny</p>
                  <p className="text-sm font-semibold">Good morning</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#DCC9A3]/30 flex items-center justify-center text-sm">
                  ☀
                </div>
              </div>
              <div className="rounded-2xl bg-white/10 border border-white/10 p-3.5 mb-3">
                <p className="text-[10px] text-white/50 mb-0.5">Vitality Score</p>
                <p className="text-3xl font-semibold text-[#DCC9A3]">82</p>
                <div className="mt-2.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full w-[82%] rounded-full bg-[#DCC9A3]" />
                </div>
              </div>
              <div className="space-y-2 flex-1">
                {['Morning Slim ritual', 'Protein check-in', 'Evening reflection'].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 rounded-xl bg-white/5 px-2.5 py-2 text-[11px]">
                    <span
                      className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[8px] ${
                        i < 2 ? 'bg-[#DCC9A3] border-[#DCC9A3] text-[#2A4035]' : 'border-white/30'
                      }`}
                    >
                      {i < 2 ? '✓' : ''}
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </SlimReveal>

          {/* Features */}
          <SlimReveal delay={140} className="order-3">
            <div className="bg-white rounded-[1.5rem] p-6 border border-[#2A4035]/8 space-y-4">
              <p className="text-sm font-semibold text-[#2C322E]">What you unlock</p>
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-xl bg-[#E8F0EA] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#2A4035]" />
                  </span>
                  <span className="text-sm text-[#2C322E]/85">{label}</span>
                </div>
              ))}
            </div>
          </SlimReveal>
        </div>
      </div>
    </section>
  );
}
