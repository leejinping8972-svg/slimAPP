import certFda from '@/assets/certified/FDA.jpg';
import certHaccp from '@/assets/certified/HACCP.jpg';
import certGmp from '@/assets/certified/GMP.jpg';
import certHalal from '@/assets/certified/Hala.jpg';

const certificates = [
  { src: certFda, label: 'FDA Registered' },
  { src: certGmp, label: 'NSF GMP Certified' },
  { src: certHaccp, label: 'HACCP Certified' },
  { src: certHalal, label: 'Halal Certified' },
];

const CertificatesSection = () => {
  return (
    <section className="py-6 sm:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <h2 className="font-display text-xl sm:text-3xl lg:text-5xl font-bold text-center text-gold-gradient mb-1.5 sm:mb-3">
            Certified <span className="font-body">&</span> Trusted
        </h2>
        <p className="font-body text-sm sm:text-base text-muted-foreground text-center mb-4 sm:mb-12 max-w-2xl mx-auto px-2">
          Independently verified by leading global authorities for quality, safety, and compliance.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {certificates.map((cert) => (
            <div
              key={cert.label}
              className="group rounded-xl overflow-hidden border border-border bg-secondary shadow-sm hover:shadow-gold transition-shadow duration-300 flex flex-col"
            >
              <div className="aspect-[4/3] sm:aspect-[3/4] flex items-center justify-center p-4 sm:p-6">
                <img
                  src={cert.src.src}
                  alt={cert.label}
                  loading="lazy"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="bg-card border-t border-border py-2 sm:py-4 px-2">
                <p className="font-display text-xs sm:text-lg font-bold text-gold-gradient text-center tracking-wide">
                  {cert.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificatesSection;
