import { defineRouting } from "next-intl/routing"
import { createNavigation } from "next-intl/navigation"
import {NEXT_LOCALE_COOKIE} from "@constants/global"

export const routing = defineRouting({
  locales: ["en", "el"],
  defaultLocale: "el",
  localePrefix: "as-needed",
  localeDetection: false,
})

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)

export type Locale = (typeof routing.locales)[number]
