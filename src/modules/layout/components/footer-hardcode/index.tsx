"use client"

import React from 'react'
import LocalizedClientLink from '@modules/common/components/localized-client-link'
import Image from 'next/image'
import FooterAccordionItem from '@modules/layout/components/footer-accordion-item'
import { useTranslations } from "next-intl"

export default function FooterHardcode() {
    const t = useTranslations()
    const currentYear = new Date().getFullYear()

    return (
    <footer className="bg-primary antialiased dark:bg-gray-800">
        <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-4 py-12 lg:py-16">
        <div className="md:hidden space-y-6">
            <div className="flex items-center mb-6">
            <LocalizedClientLink href="/">
                <Image
                src={"/bio-footer-logo.png"}
                width={235}
                height={86}
                alt={"Bio kifisia footer logo"}
                />
            </LocalizedClientLink>
            </div>
            <div className="space-y-2">
            <FooterAccordionItem title={t("footer.contactInfo")}>
                <div className="space-y-2 text-[16px] text-gray-300">
                <div className="flex items-start gap-2">
                    <LocalizedClientLink
                    href="mailto:info@bio.kifisia.gr"
                    className="text-white font-noto-sans hover:font-bold"
                    >
                    {t("footer.emailLabel")} info@bio.kifisia.gr
                    </LocalizedClientLink>
                </div>
                <div className="flex items-start gap-2">
                    <LocalizedClientLink
                    href="tel:2108013428"
                    className="text-white font-noto-sans hover:font-bold"
                    >
                    {t("footer.phoneLabel")} 210-80 13-428
                    </LocalizedClientLink>
                </div>
                </div>
            </FooterAccordionItem>
            <FooterAccordionItem title={t("footer.categories")}>
                <ul className="space-y-2 text-[16px] text-white font-noto-sans">
                <li>
                    <LocalizedClientLink
                    href="/trofima"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.food")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/prosopiki-frontida"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.personalCare")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/mama-paidi"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.momAndChild")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/athlisi-diaita"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.sportsDiet")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/ygeia-eueksia"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.healthWellness")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/aromatotherapeia"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.aromatherapy")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/proionta-kipou"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.gardenProducts")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/eidi-gia-to-spiti"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.homeGoods")}
                    </LocalizedClientLink>
                </li>
                </ul>
            </FooterAccordionItem>
            <FooterAccordionItem title={t("footer.usefulLinks")}>
                <ul className="space-y-2 text-[16px] text-white font-noto-sans">
                <li>
                    <LocalizedClientLink
                    href="/tropoi-apostolis"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.shippingMethods")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/tropoi-pliromis"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.paymentMethods")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/epistrofes-proionton"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.productReturns")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/oroi-xrisis"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.termsOfUse")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/prosopika-dedomena"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.personalData")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/sxetika-me-emas"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.aboutUsLink")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/politiki-aporripis"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.privacyPolicy")}
                    </LocalizedClientLink>
                </li>
                </ul>
            </FooterAccordionItem>
            <FooterAccordionItem title={t("footer.myAccount")}>
                <ul className="space-y-2 text-[16px] text-white font-noto-sans">
                <li>
                    <LocalizedClientLink
                    href="/my-account"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("account.title")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/epikoinonia"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.contact")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/shopping-cart"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.shoppingCart")}
                    </LocalizedClientLink>
                </li>
                <li>
                    <LocalizedClientLink
                    href="/shop"
                    className="hover:font-bold transition-colors duration-200"
                    >
                    {t("footer.shop")}
                    </LocalizedClientLink>
                </li>
                </ul>
            </FooterAccordionItem>
            <div>
                <p className="text-[15px] text-darkGrey font-bold font-noto-sans leading-relaxed">
                {t("footer.freeShippingNote")}{" "}
                <br></br> {t("footer.deliveryNote")}
                </p>
            </div>
            </div>
        </div>

        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="space-y-4">
            <div className="flex items-center gap-4 mb-4">
                <LocalizedClientLink href="/">
                <Image
                    src={"/bio-footer-logo.png"}
                    width={235}
                    height={86}
                    alt={"Bio kifisia footer logo"}
                />
                </LocalizedClientLink>
            </div>
            <h3 className="text-[20px] font-semibold font-noto-sans mb-4 text-white">
                {t("footer.contactInfo")}
            </h3>
            <div className="space-y-2 text-[16px] text-gray-300">
                <div className="flex items-start gap-2">
                <LocalizedClientLink
                    href="mailto:info@bio.kifisia.gr"
                    className="text-white font-noto-sans hover:font-bold"
                >
                    {t("footer.emailLabel")} info@bio.kifisia.gr
                </LocalizedClientLink>
                </div>
                <div className="flex items-start gap-2">
                <LocalizedClientLink
                    href="tel:2108013428"
                    className="text-white font-noto-sans hover:font-bold"
                >
                    {t("footer.phoneLabel")} 210-80 13-428
                </LocalizedClientLink>
                </div>
            </div>
            </div>
            <div className="space-y-4">
            <h3 className="text-[20px] font-semibold font-noto-sans mb-4 text-white">
                {t("footer.categories")}
            </h3>
            <ul className="space-y-2 text-[16px] text-white font-noto-sans">
                <li>
                <LocalizedClientLink
                    href="/trofima"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.food")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/prosopiki-frontida"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.personalCare")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/mama-paidi"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.momAndChild")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/athlisi-diaita"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.sportsDiet")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/ygeia-eueksia"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.healthWellness")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/aromatotherapeia"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.aromatherapy")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/proionta-kipou"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.gardenProducts")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/eidi-gia-to-spiti"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.homeGoods")}
                </LocalizedClientLink>
                </li>
            </ul>
            </div>
            <div className="space-y-4">
            <h3 className="text-[20px] font-semibold font-noto-sans mb-4 text-white">
                {t("footer.usefulLinks")}
            </h3>
            <ul className="space-y-2 text-[16px] text-white font-noto-sans">
                <li>
                <LocalizedClientLink
                    href="/tropoi-apostolis"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.shippingMethods")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/tropoi-pliromis"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.paymentMethods")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/epistrofes-proionton"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.productReturns")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/oroi-xrisis"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.termsOfUse")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/prosopika-dedomena"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.personalData")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/sxetika-me-emas"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.aboutUsLink")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/politiki-aporripis"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.privacyPolicy")}
                </LocalizedClientLink>
                </li>
            </ul>
            </div>
            <div className="space-y-4">
            <h3 className="text-[20px] font-semibold font-noto-sans mb-4 text-white">
                {t("footer.myAccount")}
            </h3>
            <ul className="space-y-2 text-[16px] text-white font-noto-sans mb-6">
                <li>
                <LocalizedClientLink
                    href="/my-account"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("account.title")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/epikoinonia"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.contact")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/shopping-cart"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.shoppingCart")}
                </LocalizedClientLink>
                </li>
                <li>
                <LocalizedClientLink
                    href="/shop"
                    className="hover:font-bold transition-colors duration-200"
                >
                    {t("footer.shop")}
                </LocalizedClientLink>
                </li>
            </ul>
            <div>
                <p className="text-[15px] text-darkGrey font-bold font-noto-sans leading-relaxed">
                {t("footer.freeShippingNote")}{" "}
                <br></br> {t("footer.deliveryNote")}
                </p>
            </div>
            </div>
        </div>
        </div>
        <div className="bg-white border-t border-gray-700">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-title-color text-center md:text-left">
                {t("footer.copyright", { year: currentYear })}
            </p>
            <div className="flex items-center gap-4">
                <p className="text-sm text-title-color text-center md:text-left">
                {t("footer.developedBy")}{" "}
                <a
                    href={"https://synergic.gr"}
                    target={"_blank"}
                    className="hover:font-bold transition-colors duration-200"
                >
                    Synergic Software
                </a>
                </p>
            </div>
            </div>
        </div>
        </div>
    </footer>
    )
}