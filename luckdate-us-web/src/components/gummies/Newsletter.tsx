'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, ArrowRight, Check } from 'lucide-react';

export default function Newsletter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 bg-mint-green/40 relative overflow-hidden"
    >
      <div className="absolute top-10 left-10 w-24 h-24 bg-white/30 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-deep-rose/20 rounded-full blur-2xl" />
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-soft-pink/40 rounded-full blur-xl" />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 relative">
        <div
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-soft mb-8">
            <Mail className="w-7 h-7 text-deep-rose" />
          </div>

          <h2 className="font-heading text-4xl md:text-5xl font-semibold text-dark-charcoal mb-6">
            Join the Bloom Community
          </h2>

          <p className="font-body text-lg text-medium-gray leading-relaxed max-w-xl mx-auto mb-10">
            Subscribe for wellness tips, exclusive offers, and be the first to know about new flavors
            and product launches.
          </p>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-8"
          >
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-6 py-4 rounded-full bg-white border-2 border-transparent focus:border-deep-rose focus:outline-none font-body text-dark-charcoal placeholder:text-medium-gray/60 shadow-soft transition-all duration-300"
                disabled={isSubmitted}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitted}
              className={`px-8 py-4 rounded-full font-body font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                isSubmitted
                  ? 'bg-green-500 text-white'
                  : 'bg-deep-rose text-white hover:shadow-soft-lg hover:scale-[1.02]'
              }`}
            >
              {isSubmitted ? (
                <>
                  <Check className="w-4 h-4" />
                  Subscribed!
                </>
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
