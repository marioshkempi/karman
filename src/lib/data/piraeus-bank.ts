import { sdk } from "@lib/config"
import { getAuthHeaders, getCacheTag, removeCartId } from "./cookies"
import { revalidateTag } from "next/cache"

/**
 * Piraeus Bank Payment Response Types
 */
export interface PiraeusBankFormData {
  api_url: string
  acquirer_id: string
  merchant_id: string
  pos_id: string
  user: string
  language_code: string
  merchant_reference: string
  BillAddrCity: string
  BillAddrCountry: string
  BillAddrLine1: string
  BillAddrPostCode: string
  BillAddrState: string
  ShipAddrCity: string
  ShipAddrCountry: string
  ShipAddrLine1: string
  ShipAddrPostCode: string
  ShipAddrState: string
  CardholderName: string
  Email: string
  HomePhone: string
  MobilePhone: string
  WorkPhone: string
}

export interface PiraeusBankCartData {
  nb_products: number
  total_amount: number
  shipping_amount: number
  products_amount: number
}

export interface PiraeusBankInitiateResponse {
  success: boolean
  transaction_id?: string
  merchant_reference?: string
  ticket?: string
  form_data?: PiraeusBankFormData
  cart_data?: PiraeusBankCartData
  installments?: number
  message?: string
  error?: string
}

export interface PiraeusBankTransaction {
  id: string
  merchant_reference: string
  ticket: string | null
  current_state: string
  successful: boolean
  amount: number
  currency_code: string
  installments: number
  pos_id: string
  language_code: string
  created_at: string
  completed_at: string | null
}

export interface PiraeusBankStatusResponse {
  success: boolean
  transaction?: PiraeusBankTransaction
  message?: string
  error?: string
}

/**
 * Initiate Piraeus Bank payment
 *
 * Creates a transaction and issues a ticket from the bank.
 * Returns all data needed to render the payment form.
 *
 * @param cartId - The cart ID to initiate payment for
 * @param installments - Number of installments (0 for one-time payment)
 * @param language - Language code ('el' or 'en')
 */
export const initiatePiraeusBankPayment = async (
  cartId: string,
  installments: number = 0,
  language: "el" | "en" = "el"
): Promise<PiraeusBankInitiateResponse> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const response = await sdk.client.fetch<PiraeusBankInitiateResponse>(
      `/store/pireausbank/validation`,
      {
        method: "POST",
        headers,
        body: {
          cart_id: cartId,
          installments,
          language,
        },
      }
    )

    return response
  } catch (error) {
    console.error("Piraeus Bank initiate error:", error)
    return {
      success: false,
      message: "Failed to initiate payment",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Get Piraeus Bank transaction status
 *
 * @param params - Either cart_id or merchant_reference
 */
export const getPiraeusBankTransactionStatus = async (params: {
  cartId?: string
  merchantReference?: string
}): Promise<PiraeusBankStatusResponse> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const queryParams = new URLSearchParams()
  if (params.cartId) queryParams.set("cart_id", params.cartId)
  if (params.merchantReference)
    queryParams.set("merchant_reference", params.merchantReference)

  try {
    const response = await sdk.client.fetch<PiraeusBankStatusResponse>(
      `/store/piraeusbank/validation?${queryParams.toString()}`,
      {
        method: "GET",
        headers,
      }
    )

    return response
  } catch (error) {
    console.error("Piraeus Bank status error:", error)
    return {
      success: false,
      message: "Failed to get transaction status",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

/**
 * Build and submit payment form to Piraeus Bank
 *
 * This creates a hidden form with all required fields and submits it
 * to redirect the user to the bank's payment page.
 *
 * @param formData - The form data returned from initiatePiraeusBankPayment
 */
export const submitPiraeusBankForm = (formData: PiraeusBankFormData): void => {
  // Create form element
  const form = document.createElement("form")
  form.method = "POST"
  form.action = formData.api_url
  form.style.display = "none"

  // Map form_data keys to bank's expected field names
  const fieldMappings: Record<string, string> = {
    acquirer_id: "AcquirerId",
    merchant_id: "MerchantId",
    pos_id: "PosId",
    user: "User",
    language_code: "LanguageCode",
    merchant_reference: "MerchantReference",
    // These are already in correct format
    BillAddrCity: "BillAddrCity",
    BillAddrCountry: "BillAddrCountry",
    BillAddrLine1: "BillAddrLine1",
    BillAddrPostCode: "BillAddrPostCode",
    BillAddrState: "BillAddrState",
    ShipAddrCity: "ShipAddrCity",
    ShipAddrCountry: "ShipAddrCountry",
    ShipAddrLine1: "ShipAddrLine1",
    ShipAddrPostCode: "ShipAddrPostCode",
    ShipAddrState: "ShipAddrState",
    CardholderName: "CardholderName",
    Email: "Email",
    HomePhone: "HomePhone",
    MobilePhone: "MobilePhone",
    WorkPhone: "WorkPhone",
  }

  // Add form fields
  Object.entries(formData).forEach(([key, value]) => {
    if (key === "api_url") return // Skip api_url, it's the action

    const fieldName = fieldMappings[key] || key
    const input = document.createElement("input")
    input.type = "hidden"
    input.name = fieldName
    input.value = String(value || "")
    form.appendChild(input)
  })

  // Append to body and submit
  document.body.appendChild(form)
  form.submit()
}

/**
 * Complete flow: Initiate payment and redirect to bank
 *
 * This is a convenience function that combines initiation and form submission.
 *
 * @param cartId - The cart ID
 * @param installments - Number of installments
 * @param language - Language code
 * @returns Promise that resolves with error info if initiation fails, or never resolves if redirect succeeds
 */
export const initiatePiraeusBankPaymentAndRedirect = async (
  cartId: string,
  installments: number = 0,
  language: "el" | "en" = "el"
): Promise<PiraeusBankInitiateResponse> => {
  const response = await initiatePiraeusBankPayment(
    cartId,
    installments,
    language
  )

  if (response.success && response.form_data) {
    // Submit form - this will redirect, so the promise won't resolve
    submitPiraeusBankForm(response.form_data)
  }

  return response
}

export type PiraeusBankSuccessResponse = {
  success: boolean
  message?: string
  order_id?: string
  transaction_id?: string
  merchant_reference?: string
  redirect_url?: string
  already_processed?: boolean
  error?: string
  error_code?: string
}
export type PiraeusBankSuccessRequest = {
  ResultCode?: string
  ResultDescription?: string
  StatusFlag?: string
  ResponseCode?: string
  ResponseDescription?: string
  MerchantReference?: string
  TransactionId?: string
  SupportReferenceID?: string
  PackageNo?: string
  AuthStatus?: string
  ApprovalCode?: string
  HashKey?: string
  Parameters?: string
}
/**
 * Process Piraeus Bank payment success callback
 * This calls the Medusa backend to validate the payment and create the order
 */
export const processPiraeusBankSuccess = async (
  data: PiraeusBankSuccessRequest
): Promise<PiraeusBankSuccessResponse> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const response = await sdk.client.fetch<PiraeusBankSuccessResponse>(
      `/store/pireausbank/success`,
      {
        method: "POST",
        headers,
        body: data,
      }
    )
    const orderCacheTag = await getCacheTag("orders")
    revalidateTag(orderCacheTag)

    removeCartId()
    return response
  } catch (error) {
    console.error("Piraeus Bank success processing error:", error)
    return {
      success: false,
      message: "Failed to process payment",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
