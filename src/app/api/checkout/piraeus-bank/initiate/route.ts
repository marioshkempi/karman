import { NextRequest, NextResponse } from "next/server"
import { initiatePiraeusBankPayment } from "@lib/data/piraeus-bank"

export async function POST(request: NextRequest) {
  try {
    const { cart_id, installments, language } = await request.json()

    if (!cart_id) {
      return NextResponse.json(
        { success: false, error: "Cart ID is required" },
        { status: 400 }
      )
    }

    const response = await initiatePiraeusBankPayment(
      cart_id,
      installments || 0,
      language || "el"
    )

    return NextResponse.json(response)
  } catch (error) {
    console.error("Piraeus Bank initiation error:", error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to initiate payment",
      },
      { status: 500 }
    )
  }
}