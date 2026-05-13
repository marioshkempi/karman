import { NextRequest, NextResponse } from "next/server"

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://biostore.synergic.systems"

async function handleFailure(request: NextRequest) {
  let errorMessage = "payment_failed"
  let merchantRef = ""
  let resultDescriptionEr = ""
  let resultCodeErr = ""

  try {
    // 1. Try to extract why it failed from the bank's data
    // We use .text() + URLSearchParams for the same compatibility reasons as Success
    const rawBody = await request.text()
    const params = new URLSearchParams(rawBody)

    const resultCode = params.get("ResultCode")
    const resultDescription = params.get("ResultDescription")
    merchantRef = params.get("MerchantReference") || ""
    resultDescriptionEr = resultDescription || ""
    merchantRef = merchantRef || ""
    resultCodeErr = resultCode || ""
    console.error(`Piraeus Payment Failed: [${resultCode}] ${resultDescription} for Ref: ${merchantRef}`)

    // You can map specific bank error codes to user-friendly messages here
    if (resultCode === "116") errorMessage = "insufficient_funds"
  } catch (e) {
    console.error("Error parsing Piraeus failure body:", e)
  }

  // 2. Construct the return URL
  const redirectUrl = new URL(`${SITE_URL}/checkout`, request.url)
  redirectUrl.searchParams.set("step", "payment")
  redirectUrl.searchParams.set("error", errorMessage)
  redirectUrl.searchParams.set("ref", merchantRef)
  redirectUrl.searchParams.set("resultCode", resultCodeErr)
  redirectUrl.searchParams.set("resultDescription", resultDescriptionEr)
  redirectUrl.searchParams.set("error_source", "piraeus");
  if (merchantRef) redirectUrl.searchParams.set("ref", merchantRef)

  // 3. Return the HTML bridge to force the browser to redirect
  return new NextResponse(
    `<!DOCTYPE html>
    <html>
      <head>
        <title>Payment Failed</title>
        <meta http-equiv="refresh" content="0;url=${redirectUrl.toString()}">
      </head>
      <body>
        <script>window.location.href = "${redirectUrl.toString()}";</script>
        <p>Payment was not successful. Redirecting you back to checkout...</p>
        <a href="${redirectUrl.toString()}">Click here if not redirected</a>
      </body>
    </html>`,
    {
      status: 200,
      headers: { "Content-Type": "text/html" },
    },
  )
}

export async function POST(request: NextRequest) {
  return handleFailure(request)
}

export async function GET(request: NextRequest) {
  return handleFailure(request)
}