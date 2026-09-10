'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/sections/Navigation';
import Footer from '@/sections/Footer';
import CartDrawer from '@/components/CartDrawer';
import UnpaidOrderFloat from '@/components/UnpaidOrderFloat';
import { GlobalCoupon } from '@/components/GlobalCoupon';
import { getRichTextDetailByCode } from '@/lib/api/goods';
import aboutImage from '@/assets/about-image.png';

interface RichTextData {
  content: string;
  title?: string;
  name?: string;
  code: string;
}

export default function AboutPage() {
  const [richText, setRichText] = useState<RichTextData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    getRichTextDetailByCode('about_us')
      .then((res) => {
        if (res.data?.data) {
          setRichText(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const pageTitle = richText?.title || richText?.name || 'About Us';

  return (
    <>
      <h1 className="sr-only">About LUCKDATE - Our Commitment to Your Health</h1>
      <div className="min-h-screen bg-[#F7F5F1]">
      <Navigation />

      <main className="pt-24 lg:pt-32">
        <section id="about-content" className="py-12 lg:py-20 bg-white overflow-hidden">
          <div className="w-full px-4 sm:px-6 lg:px-12 xl:px-20">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#D8CBB8] border-t-transparent rounded-full animate-spin" />
              </div>
            ) : richText?.content ? (
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
                
                {/* Left: Image */}
                <div className="relative lg:sticky lg:top-32">
                  <div className="relative rounded-[1.5rem] overflow-hidden shadow-xl">
                    <img 
                      src={aboutImage.src} 
                      alt="LUCKDATE team preparing healthy supplements in modern kitchen - our commitment to wellness" 
                      className="w-full h-auto object-cover aspect-[4/3]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* 5+ badge */}
                  <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-100">
                    <div className="text-4xl sm:text-5xl font-bold text-[#D8CBB8] font-['Montserrat'] leading-none">5+</div>
                    <div className="text-xs sm:text-sm text-[#6C6763]/60 mt-1">Years of Excellence</div>
                  </div>

                  {/* Decorative blurs */}
                  <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#D8CBB8]/8 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-[#D8CBB8]/12 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Right: Content from API */}
                <div className="lg:pl-4">
                  {/* Badge */}
                  <span className="inline-block text-[#e74c3c] text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 bg-[#e74c3c]/6 rounded-full border border-[#e74c3c]/15">
                    About Us
                  </span>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#4E554B] mb-5 font-['Montserrat'] leading-snug">
                    Our Commitment to{' '}
                    <span className="text-[#D8CBB8]">Your</span>{' '}
                    <span className="text-[#D8CBB8]">Health</span>
                  </h2>

                  {/* Rich Text Content from API */}
                  <div
                    className="prose prose-neutral max-w-none text-[#555] text-[15px] leading-relaxed break-words overflow-hidden"
                    style={{
                      wordWrap: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                    dangerouslySetInnerHTML={{ __html: richText.content }}
                  />
                </div>

              </div>
            ) : (
              // 默认内容：当接口没有数据时展示
              <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-6xl mx-auto">
                
                {/* Left: Image */}
                <div className="relative lg:sticky lg:top-32">
                  <div className="relative rounded-[1.5rem] overflow-hidden shadow-xl">
                    <img 
                      src={aboutImage.src} 
                      alt="LUCKDATE team preparing healthy supplements in modern kitchen - our commitment to wellness" 
                      className="w-full h-auto object-cover aspect-[4/3]" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  </div>

                  {/* 5+ badge */}
                  <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 bg-white rounded-2xl shadow-lg p-4 sm:p-5 border border-gray-100">
                    <div className="text-4xl sm:text-5xl font-bold text-[#D8CBB8] font-['Montserrat'] leading-none">5+</div>
                    <div className="text-xs sm:text-sm text-[#6C6763]/60 mt-1">Years of Excellence</div>
                  </div>

                  {/* Decorative blurs */}
                  <div className="absolute -top-8 -left-8 w-40 h-40 bg-[#D8CBB8]/8 rounded-full blur-3xl pointer-events-none" />
                  <div className="absolute -bottom-8 -left-4 w-24 h-24 bg-[#D8CBB8]/12 rounded-full blur-2xl pointer-events-none" />
                </div>

                {/* Right: Default Content */}
                <div className="lg:pl-4">
                  {/* Badge */}
                  <span className="inline-block text-[#e74c3c] text-xs font-semibold uppercase tracking-widest mb-4 px-3 py-1 bg-[#e74c3c]/6 rounded-full border border-[#e74c3c]/15">
                    About Us
                  </span>

                  {/* Title */}
                  <h2 className="text-3xl sm:text-4xl font-bold text-[#4E554B] mb-5 font-['Montserrat'] leading-snug">
                    Our Commitment to{' '}
                    <span className="text-[#D8CBB8]">Your</span>{' '}
                    <span className="text-[#D8CBB8]">Health</span>
                  </h2>

                  {/* Default Content */}
                  <div className="prose prose-neutral max-w-none text-[#555] text-[15px] leading-relaxed">
                    <p className="mb-4">
                      At LUCKDATE, we believe that true wellness starts from within. Founded with a passion for helping people live healthier, more vibrant lives, we have dedicated ourselves to creating premium supplements that deliver real results.
                    </p>
                    <p className="mb-4">
                      Our journey began with a simple mission: to make high-quality, science-backed wellness products accessible to everyone. Today, we are proud to offer a comprehensive range of supplements including NAD+, NMN, collagen peptides, and probiotics, all formulated with the finest ingredients sourced from trusted suppliers worldwide.
                    </p>
                    <p className="mb-4">
                      What sets us apart is our unwavering commitment to quality. Every product in our lineup undergoes rigorous testing and quality control to ensure purity, potency, and safety. We work closely with leading scientists and nutrition experts to develop formulations that are both effective and easy to incorporate into your daily routine.
                    </p>
                    <p className="mb-4">
                      Our team is driven by a shared vision of empowering individuals to take control of their health. Whether you are looking to boost your energy levels, support healthy aging, or enhance your overall well-being, LUCKDATE is here to support you every step of the way.
                    </p>
                    <p>
                      Join thousands of satisfied customers who have made LUCKDATE a part of their wellness journey. Together, let us build a healthier, happier future.
                    </p>
                  </div>
                </div>

              </div>
            )}
          </div>
        </section>
      </main>
      <UnpaidOrderFloat />
      <Footer />
      <CartDrawer />
      <GlobalCoupon />
    </div>
    </>
  );
}
