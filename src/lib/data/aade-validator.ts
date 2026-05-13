import { sdk } from "@lib/config"

export interface AADEBasicRec {
  afm: string
  doy: string
  doy_descr: string
  i_ni_flag_descr: string
  deactivation_flag: string
  deactivation_flag_descr: string
  firm_flag_descr: string
  onomasia: string
  commer_title: string
  legal_status_descr: string
  postal_address: string
  postal_address_no: string
  postal_zip_code: string
  postal_area_description: string
  regist_date: string
  stop_date: string | null
  normal_vat_system_flag: string
}

export interface AADEFirmActivity {
  firm_act_code: string
  firm_act_descr: string
  firm_act_kind: string
  firm_act_kind_descr: string
}

export interface VatCheckResponse {
  success: boolean
  data?: AADEBasicRec
  activities?: AADEFirmActivity[]
  error?: string
}

/**
 * Validate a Greek Tax ID (AFM) via the store API
 */
export async function checkVat(afm: string): Promise<VatCheckResponse> {
  try {
    const result = await sdk.client.fetch<VatCheckResponse>(
      `/store/vatCheck?afm=${encodeURIComponent(afm)}`,
      {
        method: "GET",
      },
    )
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Validate a Greek Tax ID (AFM) via POST
 */
export async function validateAFM(
  afm: string,
  asOnDate?: string,
): Promise<VatCheckResponse> {
  try {
    const result = await sdk.client.fetch<VatCheckResponse>(
      `/store/vatCheck`,
      {
        method: "POST",
        body: {
          afm,
          ...(asOnDate && { as_on_date: asOnDate }),
        },
      },
    )
    // console.log("validateAFM result:", result)
    return result
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}