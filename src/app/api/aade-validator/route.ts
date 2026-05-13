import { NextRequest, NextResponse } from "next/server"
import { validateAFM } from "@lib/data/aade-validator"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { afm, asOnDate } = body

    if (!afm) {
      return NextResponse.json(
        { success: false, error: "AFM is required" },
        { status: 400 },
      )
    }

    if (!/^\d{9}$/.test(afm)) {
      return NextResponse.json(
        { success: false, error: "Invalid AFM format. Must be 9 digits." },
        { status: 400 },
      )
    }

    const result = await validateAFM(afm, asOnDate)

    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}