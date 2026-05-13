import { sdk } from "@lib/config"


export interface InvoicePayload {
  afm?: string
  doy?: string
  doy_descr?: string
  i_ni_flag_descr?: string
  deactivation_flag?: string
  deactivation_flag_descr?: string
  firm_flag_descr?: string
  onomasia?: string
  commer_title?: string
  legal_status_descr?: string
  postal_address?: string
  postal_address_no?: string
  postal_zip_code?: string
  postal_area_description?: string
  normal_vat_system_flag?: string
  name?: string
  activity?: string
  address?: string
  eponumia?: any
}

export interface InvoiceResponse {
  invoice: InvoicePayload | null
  message?: string
}

export async function getInvoice(cartId: string): Promise<InvoiceResponse> {
  try {
    const result = await sdk.client.fetch<InvoiceResponse>(
      `/store/cart/${cartId}/invoice`,
      { method: "GET" },
    )
    return result
  } catch (error) {
    console.error("getInvoice error:", error)
    return { invoice: null, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createInvoice(cartId: string, data: InvoicePayload): Promise<InvoiceResponse> {
  try {
    const result = await sdk.client.fetch<InvoiceResponse>(
      `/store/cart/${cartId}/invoice`,
      {
        method: "POST",
        body: data,
      },
    )
    return result
  } catch (error) {
    console.error("createInvoice error:", error)
    return { invoice: null, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function updateInvoice(cartId: string, data: InvoicePayload): Promise<InvoiceResponse> {
  try {
    const result = await sdk.client.fetch<InvoiceResponse>(
      `/store/cart/${cartId}/invoice`,
      {
        method: "PUT",
        body: data,
      },
    )
    return result
  } catch (error) {
    console.error("updateInvoice error:", error)
    return { invoice: null, message: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function deleteInvoice(cartId: string): Promise<InvoiceResponse> {
  try {
    const result = await sdk.client.fetch<InvoiceResponse>(
      `/store/cart/${cartId}/invoice`,
      { method: "DELETE" },
    )
    console.log("deleteInvoice result:", result)
    return result
  } catch (error) {
    console.error("deleteInvoice error:", error)
    return { invoice: null, message: error instanceof Error ? error.message : "Unknown error" }
  }
}