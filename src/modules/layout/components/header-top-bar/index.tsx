"use client"

import Image from "next/image"
import { useState } from "react"
import ContentBlockRenderer from "@modules/common/components/content-block/content-block"
import { useTranslations } from "next-intl"

const HeaderTopBar = ({ topbarText }: any) => {
  const t = useTranslations()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="w-full bg-menubg text-white py-3">
      <div className="max-w-[1320px] mx-auto px-4 flex items-center justify-between">
        <div className="flex-1">
          <ContentBlockRenderer blocks={[topbarText]} />
          {/*<p className="text-[14px] hidden md:block">*/}
          {/*  Δωρεάν αποστολή για παραγγελίες άνω των 49€ μέχρι 2 kg. Παράδοση*/}
          {/*  προϊόντων σε 1 - 3 ημέρες*/}
          {/*</p>*/}
          {/*<p className="text-[11px] text-center md:hidden">*/}
          {/*  Δωρεάν αποστολή για παραγγελίες άνω των 49€ μέχρι 2 kg.*/}
          {/*</p>*/}
        </div>

        <div className="hidden md:flex items-center gap-4 text-[14px]">
          <div className="flex items-center gap-3">
            <a
              href="https://www.facebook.com/bio.kifisia"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/socials/facebook.svg"
                alt="Facebook"
                width={22}
                height={22}
              />
            </a>
            <a
              href="https://x.com/biokifisia?lang=el"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image src="/socials/X.svg" alt="X" width={22} height={22} />
            </a>
            <a
              href="https://www.instagram.com/biokifisia_eshop/?hl=el"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src="/socials/instagram.svg"
                alt="Instagram"
                width={22}
                height={22}
              />
            </a>
          </div>
          <div>
            {t("header.phone")}{" "}
            <span className="font-semibold">
              <a href={"tel:210 80 13 428"}>210 80 13 428</a>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeaderTopBar
