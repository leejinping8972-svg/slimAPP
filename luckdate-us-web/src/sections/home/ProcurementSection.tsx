'use client';

import Image, { type StaticImageData } from 'next/image';
import fsscCert from '@/assets/home/certs/procurement/fssc-certificate.png';
import halalCert from '@/assets/home/certs/procurement/halal-certificate.jpg';
import kosherCert from '@/assets/home/certs/procurement/kosher-certificate.png';
import amcorSpec from '@/assets/home/certs/procurement/amcor-packaging-spec.png';

const CONTROLS = [
  'FSSC 22000',
  'Kosher certification',
  'Halal certification',
  'Pasture fed',
  'GMO free',
  'rBST free',
  'BSE free',
];

type Doc = {
  src: StaticImageData;
  alt: string;
  label: string;
  orient: 'portrait' | 'landscape';
};

const DOCS: Doc[] = [
  {
    src: fsscCert,
    alt: 'FSSC 22000 Certificate of Registration',
    label: 'FSSC 22000',
    orient: 'portrait',
  },
  {
    src: halalCert,
    alt: 'Halal Certificate — Islamic Co-ordinating Council of Victoria',
    label: 'Halal',
    orient: 'portrait',
  },
  {
    src: amcorSpec,
    alt: 'Amcor high-barrier packaging sales specification',
    label: 'Packaging spec',
    orient: 'portrait',
  },
  {
    src: kosherCert,
    alt: 'Kosher Certificate — Kosher Australia',
    label: 'Kosher',
    orient: 'landscape',
  },
];

/**
 * Standardized procurement intro — quality controls + source certificates.
 * Placed between WPC80 foundation and Slim product series.
 */
export function ProcurementSection() {
  return (
    <section id="procurement" className="relative overflow-hidden bg-white py-14 sm:py-16 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_8%_20%,rgba(0,0,0,0.03)_0%,transparent_40%),radial-gradient(ellipse_at_92%_80%,rgba(0,0,0,0.025)_0%,transparent_42%)]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="mb-8 max-w-2xl lg:mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6B7A62]">
            Standardized procurement
          </p>
          <h2 className="mt-2 font-['Montserrat'] text-2xl font-bold leading-tight tracking-[-0.02em] text-[#111111] sm:text-3xl lg:text-[2.25rem]">
            Strict quality control for WPC80
          </h2>
        </div>

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-10 xl:gap-14">
          <div className="border border-[#C45C4A]/70 bg-[#FBF9F6] px-5 py-6 sm:px-6 sm:py-7">
            <h3 className="font-['Montserrat'] text-lg font-bold text-[#111111]">
              Sunpro WPC80 — audited source controls
            </h3>
            <ul className="mt-5 space-y-2.5">
              {CONTROLS.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45C4A]" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>

            <h4 className="mt-8 font-['Montserrat'] text-base font-bold text-[#111111]">
              Additional safeguards
            </h4>
            <p className="mt-2 flex items-start gap-2.5 text-sm font-medium text-[#1A1A1A]">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C45C4A]" aria-hidden />
              High-spec barrier packaging materials (Amcor / Orora bag film)
            </p>
            <p className="mt-5 text-xs leading-relaxed text-[#555555]">
              Certificates shown for reference. Validity periods and scopes are maintained by the
              issuing bodies; ask us for the latest COA and registration pack.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 lg:gap-4">
              {DOCS.filter((d) => d.orient === 'portrait').map((doc) => (
                <figure key={doc.label} className="min-w-0">
                  <div className="relative aspect-[3/4] overflow-hidden border border-[#111111]/10 bg-white shadow-sm">
                    <Image
                      src={doc.src}
                      alt={doc.alt}
                      fill
                      className="object-contain object-top p-1.5 sm:p-2"
                      sizes="(min-width: 1024px) 16vw, 30vw"
                    />
                  </div>
                  <figcaption className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#555555]">
                    {doc.label}
                  </figcaption>
                </figure>
              ))}
            </div>

            {DOCS.filter((d) => d.orient === 'landscape').map((doc) => (
              <figure key={doc.label} className="min-w-0">
                <div className="relative aspect-[16/9] overflow-hidden border border-[#111111]/10 bg-white shadow-sm sm:aspect-[21/9]">
                  <Image
                    src={doc.src}
                    alt={doc.alt}
                    fill
                    className="object-contain object-center p-2 sm:p-3"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                </div>
                <figcaption className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.12em] text-[#555555]">
                  {doc.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
