import React from 'react';
import { listPopularCategorySections } from '@lib/data/popular-categories';
import Link from 'next/link';
import PopularCategorySlider from './popular-category-slider';
import { getTranslations } from 'next-intl/server';

const FALLBACK_CATEGORIES = [
  {
    title: 'Περιποίηση Σώματος',
    image: '/images/category/img1.png',
    url: '#'
  },
  {
    title: 'Περιποίηση Προσώπου',
    image: '/images/category/img2.png',
    url: '#'
  },
  {
    title: 'Μαμά - Παιδί',
    image: '/images/category/img3.png',
    url: '#'
  },
  {
    title: 'Άθληση - Δίαιτα',
    image: '/images/category/img4.png',
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
      <section className="w-full bg-white py-10 lg:py-14">
        <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
          {/* Section Header */}
          <div className="mb-8 lg:mb-10">
            <h2 className="text-2xl lg:text-3xl text-gray-900 font-bold tracking-tight uppercase">
              {t("popularCategories.title")}
            </h2>
            <div className="w-16 h-1 bg-red-600 mt-3"></div>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {FALLBACK_CATEGORIES.map((category, index) => (
              <div key={index} className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-300" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                  <h3 className="text-white text-base lg:text-lg font-bold uppercase tracking-wide mb-2">
                    {category.title}
                  </h3>
                  <span className="inline-flex items-center text-xs lg:text-sm text-white/90 font-medium group-hover:text-red-400 transition-colors">
                    {t("product.learnMore")}
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      {activeSections.map((section) => {
        const items = section.items;
        const hasMoreThanFour = items.length > 4;

        return (
          <section key={section.id} className="w-full bg-white py-10 lg:py-14">
            <div className="max-w-[1350px] mx-auto px-4 lg:px-8">
              {/* Section Header */}
              <div className="mb-8 lg:mb-10">
                <h2 className="text-2xl lg:text-3xl text-gray-900 font-bold tracking-tight uppercase">
                  {section.title}
                </h2>
                <div className="w-16 h-1 bg-red-600 mt-3"></div>
              </div>

              {hasMoreThanFour ? (
                <PopularCategorySlider items={items} ctaText={section.cta_text} />
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
                  {items.map((item) => (
                    <PopularCategoryCard key={item.id} item={item} ctaText={section.cta_text} />
                  ))}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </>
  );
}

function PopularCategoryCard({ item, ctaText }: { item: any; ctaText: string }) {
  const href = item.url || '#';
  const isExternal = href.startsWith('http');

  const content = (
    <div className="relative w-full aspect-[4/3] overflow-hidden rounded-lg group cursor-pointer">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
          <span className="text-gray-500 text-sm">No Image</span>
        </div>
      )}
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 transition-all duration-300" />
      
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
        <h3 className="text-white text-base lg:text-lg font-bold uppercase tracking-wide mb-2">
          {item.title}
        </h3>
        <span className="inline-flex items-center text-xs lg:text-sm text-white/90 font-medium group-hover:text-red-400 transition-colors">
          {ctaText}
          <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
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
