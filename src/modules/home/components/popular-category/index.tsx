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
      <div className="w-full bg-white mb-8 lg:mb-11">
        <div className="max-w-[1350px] mx-auto px-3 lg:px-4">
          <h2 className="text-[20px] lg:text-[30px] text-primary font-medium mb-4 lg:mb-8">
            {t("popularCategories.title")}
          </h2>

          {/* Mobile: 1 column stacked, Desktop: 4 column grid */}
          <div className="flex flex-col gap-2 lg:grid lg:grid-cols-4 lg:gap-6">
            {FALLBACK_CATEGORIES.map((category, index) => (
              <div key={index} className="relative w-full h-[160px] lg:h-auto lg:aspect-[4/3] overflow-hidden rounded-lg group">
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Dark overlay */}
                <div className="absolute inset-0 bg-black/40" />
                
                {/* Content inside card */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex flex-col items-start gap-2">
                  <h3 className="text-white text-[20px] lg:text-xl font-extrabold drop-shadow-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {category.title}
                  </h3>
                  <span className="inline-block px-4 py-2 bg-white text-gray-800 text-[12px] lg:text-sm font-extrabold rounded-full hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
                    {t("product.learnMore")}
                  </span>
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
              <h2 className="text-[20px] lg:text-[30px] text-primary font-medium mb-4 lg:mb-8">
                {section.title}
              </h2>

              {hasMoreThanFour ? (
                <PopularCategorySlider items={items} ctaText={section.cta_text} />
              ) : (
                <div className="flex flex-col gap-2 lg:grid lg:grid-cols-4 lg:gap-6">
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
  // console.log(item);
  const href = item.url || '#';
  const isExternal = href.startsWith('http');

  const content = (
    <div className="relative w-full h-[160px] lg:h-auto lg:aspect-[4/3] overflow-hidden rounded-lg group">
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={item.title}
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
        <h3 className="text-white text-[20px] lg:text-xl font-extrabold drop-shadow-lg" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {item.title}
        </h3>
        <span className="inline-block px-4 py-2 bg-white text-gray-800 text-[12px] lg:text-sm font-extrabold rounded-full hover:bg-gray-100 transition-colors" style={{ fontFamily: 'Manrope, sans-serif' }}>
          {ctaText}
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
