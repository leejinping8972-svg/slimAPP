'use client';

import { Truck, Shield, Clock, Package, Check } from 'lucide-react';

const shippingFeatures = [
  {
    icon: <Truck className="w-6 h-6 text-deep-rose" />,
    title: 'Free Standard Shipping',
    description:
      'Complimentary USPS shipping on all orders within the continental United States.',
  },
  {
    icon: <Clock className="w-6 h-6 text-deep-rose" />,
    title: '3–5 Business Days',
    description:
      'Standard delivery typically arrives within 3–5 business days after order processing.',
  },
  {
    icon: <Shield className="w-6 h-6 text-deep-rose" />,
    title: 'Tracking Included',
    description:
      'Every order includes a tracking number so you can follow your package in real time.',
  },
];

export default function Shipping() {
  return (
    <section id="shipping" className="py-20 lg:py-28 bg-light-gray">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-6 shadow-soft">
            <Package className="w-4 h-4 text-deep-rose" />
            <span className="text-sm font-body font-medium text-dark-charcoal">Shipping & Delivery</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-dark-charcoal mb-4">
            Fast & Free U.S. Shipping
          </h2>
          <p className="font-body text-base md:text-lg text-medium-gray">
            We ship all orders from within the United States for the fastest possible delivery — no
            customs, no delays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {shippingFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-xs hover:shadow-soft-lg transition-all duration-500 border border-dark-charcoal/5 text-center"
            >
              <div className="w-14 h-14 bg-soft-pink/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="font-heading text-lg font-semibold text-dark-charcoal mb-2">
                {feature.title}
              </h3>
              <p className="font-body text-sm text-medium-gray leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 shadow-soft border border-dark-charcoal/5">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-heading text-xl font-semibold text-dark-charcoal mb-4">
                Shipping Policy
              </h4>
              <ul className="space-y-3">
                {[
                  'Orders placed before 2 PM PST ship the same business day',
                  'Free standard shipping on all U.S. orders',
                  'We currently ship to all 50 U.S. states',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-mint-green stroke-[3] mt-0.5 shrink-0" />
                    <span className="font-body text-sm text-medium-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-heading text-xl font-semibold text-dark-charcoal mb-4">
                Returns & Guarantee
              </h4>
              <ul className="space-y-3">
                {[
                  '30-day money-back guarantee on all orders',
                  'Hassle-free refunds — no reason needed if unopened & resalable',
                  'Contact support@luckdate.com for return requests',
                  'Refunds processed within 3–5 business days',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-mint-green stroke-[3] mt-0.5 shrink-0" />
                    <span className="font-body text-sm text-medium-gray">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
