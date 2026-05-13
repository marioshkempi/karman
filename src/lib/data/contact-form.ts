"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"
import medusaError from "@lib/util/medusa-error"

export interface ContactFormEntry {
  subject: string
  email: string
  message: string,
  captchaToken: string,
}

export async function addContactFormEntry(data: ContactFormEntry) {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
  }

  try {
    const contactresponse = await sdk.client.fetch("/store/contact-form", {
      method: "POST",
      body: data,
      headers,
    })
    return contactresponse
  } catch (error) {
    medusaError(error)
    return { success: false, error }
  }
}
