import TrackOrderTemplate from "@modules/track-order/templates"
import Reassurances from "@modules/common/components/reassurances"
import { Metadata } from "next"
import { getTranslations } from "next-intl/server"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations()
  return {
    title: t("trackOrder.title"),
    description: t("trackOrder.metaDescription"),
    openGraph: {
      title: t("trackOrder.title"),
      description: t("trackOrder.metaDescriptionShort"),
    },
  }
}

type Props = {
  params: Promise<{
    countryCode: string
  }>
}

export default async function TrackOrderPage(props: Props) {
  const params = await props.params
  const { countryCode } = params

  return (
    <>
      <TrackOrderTemplate />
    </>
  )
}
