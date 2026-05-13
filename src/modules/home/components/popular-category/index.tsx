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
        <div className="max-w-[1350px] mx-auto px-4">
          <h2 className="text-[20px] lg:text-[30px] text-primary font-medium mb-6 lg:mb-8">
            {t("popularCategories.title")}
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {FALLBACK_CATEGORIES.map((category, index) => (
              <div key={index} className="flex flex-col">
                <div className="relative w-full h-[183px] lg:h-[332.4px] overflow-hidden mb-3">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 p-4">
                    <h3 className="text-white text-[20px] lg:text-[24px] lg:text-xl font-medium">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <button className="w-full py-3 px-4 border border-primary text-gray-700 text-sm lg:text-base transition-colors">
                  {t("product.learnMore")}
                </button>
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
            <div className="max-w-[1350px] mx-auto px-4">
              <h2 className="text-[20px] lg:text-[30px] text-primary font-medium mb-6 lg:mb-8">
                {section.title}
              </h2>

              {hasMoreThanFour ? (
                <PopularCategorySlider items={items} ctaText={section.cta_text} />
              ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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
    <>
      <div className="relative w-full h-[183px] lg:h-[332.4px] overflow-hidden mb-3">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-white text-[20px] lg:text-[24px] lg:text-xl font-medium">
            {item.title}
          </h3>
        </div>
      </div>

      <button className="w-full py-3 px-4 border border-primary text-gray-700 text-sm lg:text-base transition-colors hover:bg-primary hover:text-white transition-colors">
        {ctaText}
      </button>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col">
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className="flex flex-col">
      {content}
    </Link>
  );
}