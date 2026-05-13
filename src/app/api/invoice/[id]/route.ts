import { NextRequest, NextResponse } from "next/server"
import {
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  InvoicePayload,
} from "@lib/data/invoice"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const cartId = params.id
  if (!cartId) return NextResponse.json({ message: "cart id is required" }, { status: 400 })

  try {
    const result = await getInvoice(cartId)
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error("GET invoice error:", error)
    return NextResponse.json({ invoice: null, message: error.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const cartId = params.id
  if (!cartId) return NextResponse.json({ message: "cart id is required" }, { status: 400 })

  try {
    const body: InvoicePayload = await req.json()
    const result = await createInvoice(cartId, body)
    return NextResponse.json(result, { status: 201 })
  } catch (error: any) {
    console.error("POST invoice error:", error)
    return NextResponse.json({ invoice: null, message: error.message }, { status: 500 })
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const cartId = params.id
  if (!cartId) return NextResponse.json({ message: "cart id is required" }, { status: 400 })

  try {
    const body: InvoicePayload = await req.json()
    const result = await updateInvoice(cartId, body)
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error("PUT invoice error:", error)
    return NextResponse.json({ invoice: null, message: error.message }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const cartId = params.id
  if (!cartId) return NextResponse.json({ message: "cart id is required" }, { status: 400 })

  try {
    const result = await deleteInvoice(cartId)
    return NextResponse.json(result, { status: 200 })
  } catch (error: any) {
    console.error("DELETE invoice error:", error)
    return NextResponse.json({ invoice: null, message: error.message }, { status: 500 })
  }
}