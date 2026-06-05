import React from 'react';
import { listPopularCategorySections } from '@lib/data/popular-categories';
import Link from 'next/link';
import PopularCategorySlider from './popular-category-slider';
import { getTranslations } from 'next-intl/server';

const FALLBACK_CATEGORIES = [
  {
    title: 'Λιπαντικά',
    description: 'Κορυφαία λιπαντικά για μέγιστη προστασία και απόδοση του κινητήρα.',
    image: '/images/promo/lipantika.jpg',
    url: '#'
  },
  {
    title: 'Αρωματικά',
    description: 'Απολαύστε φρεσκάδα σε κάθε διαδρομή με premium αρώματα.',
    image: '/images/promo/aromatika.jpg',
    url: '#'
  },
  {
    title: 'Καθαρισμός & Περιποίηση',
    description: 'Προϊόντα καθαρισμού για αστραφτερό αυτοκίνητο μέσα-έξω.',
    image: '/images/promo/katharismos.jpg',
    url: '#'
  },
  {
    title: 'Αξεσουάρ',
    description: 'Πρακτικά αξεσουάρ που αναβαθμίζουν την εμπειρία οδήγησης.',
    image: '/images/promo/aksesoyar.jpg',
    url: '#'
  },
  {
    title: 'Πρόσθετα κινητήρα',
    description: 'Ενισχύστε την απόδοση με εξειδικευμένα πρόσθετα κινητήρα.',
    image: '/images/promo/prostheta.jpg',
    url: '#'
  }
];

export default async function PopularCategories() {
  const t = await getTranslations();
  const { sections } = await listPopularCategorySections();
  
  const activeSections = sections?.filter(section => 
    section.items && section.items.length > 0
  ) || [];

  if (activeSections.length === 0) {
    return (
      <div className="w-full bg-white mb-8 lg:mb-11">
        <div className="max-w-[1350px] mx-auto px-3 lg:px-4">
          {/* Mobile: 1 column stacked, Desktop: 5 column grid */}
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-5 lg:gap-4">
            {FALLBACK_CATEGORIES.map((category, index) => (
              <div key={index} className="relative w-full h-[180px] lg:h-[281px] overflow-hidden rounded-lg group">
                <img
                  src={category.image}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Content inside card */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
                  <span className="text-white/70 text-[12px] font-medium uppercase tracking-wide">
                    ΠΡΟΣΤΑΣΙΑ
                  </span>
                  <h3 className="text-white text-[22px] lg:text-[26px] font-extrabold leading-tight drop-shadow-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {category.title}
                  </h3>
                  <p className="text-white/70 text-[13px] leading-snug line-clamp-2">
                    {category.description}
                  </p>
                  <button className="mt-1 px-5 py-2 border border-white text-white text-[13px] font-semibold rounded-full bg-transparent hover:bg-white hover:text-gray-800 transition-colors">
                    Αγόρασε τώρα
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {activeSections.map((section) => {
        const items = section.items;
        const hasMoreThanFour = items.length > 4;

        return (
          <div key={section.id} className="w-full bg-white mb-8 lg:mb-11">
            <div className="max-w-[1350px] mx-auto px-3 lg:px-4">
              {hasMoreThanFour ? (
                <PopularCategorySlider items={items} ctaText={section.cta_text} />
              ) : (
                <div className="flex flex-col gap-3 lg:grid lg:grid-cols-5 lg:gap-4">
                  {items.map((item) => (
                    <PopularCategoryCard key={item.id} item={item} ctaText={section.cta_text} />
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </>
  );
}

function PopularCategoryCard({ item, ctaText }: { item: any; ctaText: string }) {
  const href = item.url || '#';
  const isExternal = href.startsWith('http');

  const content = (
    <div className="relative w-full h-[180px] lg:h-[281px] overflow-hidden rounded-lg group">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt=""
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No Image</span>
        </div>
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Content inside card */}
      <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
        <span className="text-white/70 text-[12px] font-medium uppercase tracking-wide">
          ΠΡΟΣΤΑΣΙΑ
        </span>
        <h3 className="text-white text-[22px] lg:text-[26px] font-extrabold leading-tight drop-shadow-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {item.title}
        </h3>
        <button className="mt-1 px-5 py-2 border border-white text-white text-[13px] font-semibold rounded-full bg-transparent hover:bg-white hover:text-gray-800 transition-colors">
          {ctaText}
        </button>
      </div>
    </div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
