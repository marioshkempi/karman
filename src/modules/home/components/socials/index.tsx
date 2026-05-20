import React from 'react';
import Image from 'next/image';
import { StoreSocial } from '@lib/data/socials';

type SocialFollowSectionProps = {
  socials: StoreSocial[];
};

type DefaultSocialLink = {
  name: string;
  url: string;
  icon: string;
  primaryIcon?: never;
  secondaryIcon?: never;
};

type DynamicSocialLink = {
  name: string;
  url: string;
  primaryIcon: string;
  secondaryIcon: string | null;
  icon?: never;
};

type SocialLink = DefaultSocialLink | DynamicSocialLink;

export default function SocialFollowSection({ socials }: SocialFollowSectionProps) {
  const defaultSocialLinks: DefaultSocialLink[] = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/bio.kifisia",
      icon: "/images/socials/facebook.svg",
    },
    {
      name: "X",
      url: "https://x.com/biokifisia?lang=el",
      icon: "/images/socials/X.svg",
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/biokifisia_eshop/?hl=el",
      icon: "/images/socials/instragram.svg",
    },
  ]

  // const socialLinks: SocialLink[] =
  //   socials.length > 0
  //     ? socials.map((social) => ({
  //         name: social.label,
  //         url: social.link,
  //         primaryIcon: social.primary_icon,
  //         secondaryIcon: social.secondary_icon,
  //       }))
  //     : defaultSocialLinks;
  const socialLinks: SocialLink[] =
    defaultSocialLinks;
  // const hasDynamicSocials = socials.length > 0;

  return (
    <div className="hidden">
      <div className="max-w-[1350px] mx-auto px-2">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6 md:justify-center">
          <span className="text-secondary text-[22px] lg:text-[22px] font-normal">
            Ακολουθείστε μας στα social
          </span>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border-2 border-secondary flex items-center justify-center bg-white hover:bg-primary hover:border-primary hover:scale-110 transition-all duration-300 ease-in-out group"
                aria-label={`Ακολουθήστε μας ${social.name}`}
              >
                {"primaryIcon" in social ? (
                  <div
                    className="w-6 h-6 flex items-center justify-center transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                    dangerouslySetInnerHTML={{
                      __html: social.primaryIcon ?? "",
                    }}
                  />
                ) : (
                  <Image
                    src={social.icon}
                    alt={social.name}
                    width={30}
                    height={30}
                    className="w-4 h-4 transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                  />
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
