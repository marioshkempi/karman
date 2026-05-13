"use server"

import { cookies as nextCookies } from "next/headers"

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const cookies = await nextCookies();
    const token = cookies.get("_medusa_jwt")?.value;
    return !!token; 
  } catch {
    return false;
  }
}