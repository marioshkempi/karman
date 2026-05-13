import { Metadata } from "next"
import ContactForm from "@modules/contact-us/components/contact-us-form"
import SocialFollowSection from "@modules/home/components/socials"
import React from "react"
import { getCaptchaConfig, getSiteSetting } from "@lib/data/site-settings"
import { retrieveCustomer } from "@lib/data/customer"
import { getPageSeo, toNextMetadata } from "@lib/data/seo"
import { JsonLd } from "@lib/util/structured-data"

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getPageSeo("contact")

  return toNextMetadata(seo, {
    title: "Contact Us",
    description: "Get in touch with us.",
  })
}

export default async function page() {
  // const siteKey: any = await getSiteSetting("captcha_site_key")
  const [customer, seo] = await Promise.all([
    retrieveCustomer().catch(() => null),
    getPageSeo("contact"),
  ])

  return (
    <>
      {seo?.structured_data && <JsonLd data={seo.structured_data} />}
      <ContactForm customer={customer} />

      {/*<ContactForm siteKey={siteKey} customer={customer} />*/}
      <SocialFollowSection socials={[]} />
    </>
  )
}
