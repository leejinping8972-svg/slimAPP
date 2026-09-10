import certFda from '@/assets/certified/FDA.jpg';
import certGmp from '@/assets/certified/GMP.jpg';
import certHaccp from '@/assets/certified/HACCP.jpg';
import certHalal from '@/assets/certified/Hala.jpg';
import { LazyImg } from './LazyMedia';

const certificates = [
  { name: 'FDA Registered', image: certFda },
  { name: 'NSF GMP Certified', image: certGmp },
  { name: 'HACCP Certified', image: certHaccp },
  { name: 'Halal Certified', image: certHalal },
];

const CertificatesSection = () => {
  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-secondary">
      <div className="container mx-auto px-3 sm:px-4">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-display text-center mb-2 sm:mb-3 text-brand-dark">
          Trusted <span className="font-sans">&amp;</span> Certified
        </h2>
        <p className="text-center text-sm sm:text-base text-muted-foreground mb-5 sm:mb-8 max-w-2xl mx-auto">
          Independently verified by globally recognized quality, safety, and compliance authorities.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5 lg:gap-6">
          {certificates.map((c, i) => (
            <div
              key={i}
              className="bg-background rounded-xl p-2.5 sm:p-4 border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="aspect-[3/4] w-full overflow-hidden rounded-lg bg-secondary/40 flex items-center justify-center p-1.5 sm:p-2">
                <LazyImg
                  src={c.image.src}
                  alt={`${c.name} certificate`}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="mt-2 sm:mt-3 text-xs sm:text-base font-bold text-brand-dark text-center leading-snug break-words">
                {c.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
