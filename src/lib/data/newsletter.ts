"use server"

import { sdk } from "@lib/config"
import { retrieveCustomer } from "@lib/data/customer"

type NewsletterSubscribeInput = {
  email: string
  first_name?: string
  last_name?: string
  customer_id?: any
}

type NewsletterResponse = {
  success: boolean
  message: string
  subscriber?: {
    id: string
    email: string
    first_name: string | null
    last_name: string | null
    is_active: boolean
    subscribed_at: string
  }
}

export async function subscribeToNewsletter(
  data: NewsletterSubscribeInput
): Promise<NewsletterResponse> {
  let customerId = data.customer_id

  if (!customerId) {
    try {
      const customer = await retrieveCustomer()
      customerId = customer?.id
    } catch {}
  }

  try {
    const result = await sdk.client.fetch<{
      message: string
      subscriber: NewsletterResponse["subscriber"]
    }>("/store/newsletter", {
      method: "POST",
      body: {
        email: data.email.toLowerCase().trim(),
        first_name: data.first_name,
        last_name: data.last_name,
        customer_id: customerId,
      },
    })

    return {
      success: true,
      message: result.message || "Successfully subscribed!",
      subscriber: result.subscriber,
    }
  } catch (error: any) {
    console.error("Newsletter subscribe error:", error)
    return {
      success: false,
      message: error?.message || "Failed to subscribe. Please try again.",
    }
  }
}

export async function unsubscribeFromNewsletter(
  email: string
): Promise<NewsletterResponse> {
  try {
    const result = await sdk.client.fetch<{ message: string }>(
      "/store/newsletter",
      {
        method: "DELETE",
        body: {
          email: email.toLowerCase().trim(),
        },
      }
    )

    return {
      success: true,
      message:
        result.message || "Successfully unsubscribed from the newsletter.",
    }
  } catch (error: any) {
    console.error("Newsletter unsubscribe error:", error)
    return {
      success: false,
      message:
        error?.message || "Failed to unsubscribe. Please try again later.",
    }
  }
}
