import { ArrowUpRightMini } from "@medusajs/icons"
import Link from "next/link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type NotFoundDataProps = {
  title?: string
  description?: string
  linkText?: string
  linkHref?: string
}

export default function NotFoundData({
  title = "No data found",
  description = "The data you're looking for doesn't exist or hasn't been created yet.",
  linkText = "Go to frontpage",
  linkHref = "/",
}: NotFoundDataProps) {
  return (
    <div className="flex flex-col gap-4 items-center justify-center pt-10">
      <h1 className="text-2xl font-semibold text-secondary">{title}</h1>
      <p className="text-sm text-secondary">{description}</p>
      <LocalizedClientLink className="flex gap-x-1 items-center group hover:underline" href={linkHref}>
        <span className="text-primary2">{linkText}</span>
        <ArrowUpRightMini
          className="group-hover:rotate-45 ease-in-out duration-150"
          color="#969633"
        />
      </LocalizedClientLink>
    </div>
  )
}