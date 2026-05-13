export type CaptchaConfig = {
  enabled: boolean
  version: "v2_checkbox" | "v2_invisible" | "v3" | "turnstile"
  site_key: string
  protected_forms: string[] // e.g. ["login", "register", "contact", "newsletter", "checkout", "review"]
}
