"use server"
import { sdk } from "@lib/config"
import { getAuthHeaders } from "@lib/data/cookies"

export const addSlmEntry = async (
  cartId: string,
  lockerId: string,
  numericId: string,
  name: string,
  latinName: string,
  latinAddress: string,
  streetName: string,
  streetNumber: string,
  zip: string,
  city: string,
  latinCity: string,
  region: string,
) => {
  const headers = {
    ...(await getAuthHeaders()),
    "Content-Type": "application/json",
  }
  try {
    await sdk.client.fetch("/store/slmshipping/locker", {
      method: "POST",
      headers,
      body:
        {
          cart_id: cartId,
          locker_id: lockerId,
          numeric_id: numericId,
          name,
          latin_name: latinName,
          latin_address: latinAddress,
          street_name: streetName,
          street_number: streetNumber,
          zip,
          city,
          latin_city: latinCity,
          region,
        }
      ,
    })
  } catch (error) {
    console.error(error)
  }

}