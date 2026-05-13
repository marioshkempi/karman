import { cookies } from "next/headers"
import { MEDUSA_LOCALE_COOKIE } from "@constants/global"

export const getLocaleHeader = async () => {
  try {
    const cookies_ = await cookies()
    const locale: any = cookies_.get(MEDUSA_LOCALE_COOKIE)?.value

    return { "x-medusa-locale": locale }
  } catch {
    return { "x-medusa-locale": "el-GR" }
  }
}
