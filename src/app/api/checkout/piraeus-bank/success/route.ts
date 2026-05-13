import { NextRequest, NextResponse } from "next/server"
import { processPiraeusBankSuccess } from "@lib/data/piraeus-bank"

const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://biostore.synergic.systems"

/**
 * POST /api/checkout/piraeus-bank/success
 *
 * Processes Piraeus Bank payment callback (form-encoded POST from bank)
 */
export async function POST(request: NextRequest) {
  try {
    // Bank sends form-encoded data, not JSON
    const formData = await request.formData()

    const body = {
      ResultCode: formData.get("ResultCode") as string,
      ResultDescription: formData.get("ResultDescription") as string,
      StatusFlag: formData.get("StatusFlag") as string,
      ResponseCode: formData.get("ResponseCode") as string,
      ResponseDescription: formData.get("ResponseDescription") as string,
      MerchantReference: formData.get("MerchantReference") as string,
      TransactionId: formData.get("TransactionId") as string,
      SupportReferenceID: formData.get("SupportReferenceID") as string,
      PackageNo: formData.get("PackageNo") as string,
      AuthStatus: formData.get("AuthStatus") as string,
      ApprovalCode: formData.get("ApprovalCode") as string,
      HashKey: formData.get("HashKey") as string,
      Parameters: formData.get("Parameters") as string,
    }

    if (!body.MerchantReference) {
      return NextResponse.redirect(
        new URL(`${SITE_URL}/checkout?error=missing_reference`),
      )
    }

    const response = await processPiraeusBankSuccess(body)

    if (response.success && response.order_id) {
      // const res = NextResponse.redirect(
      //   new URL(`${SITE_URL}/order/${response.order_id}/confirmed`),
      // )
      // res.cookies.delete("_medusa_cart_id")
      // return res
      const redirectUrl = response.success
        ? `${SITE_URL}/order/${response.order_id}/confirmed`
        : `${SITE_URL}/checkout?error=payment_failed`

      // Create the response object
      const nextResponse = new NextResponse(
        `<!DOCTYPE html>
      <html>
        <head><title>Redirecting...</title></head>
        <body>
          <script>window.location.href = "${redirectUrl}";</script>
        </body>
      </html>`,
        { status: 200, headers: { "Content-Type": "text/html" } },
      )

      // DELETE COOKIE HERE
      // This adds the 'Set-Cookie: _medusa_cart_id=; Max-Age=0' header to the response
      nextResponse.cookies.set("_medusa_cart_id", "", {
        path: "/",
        maxAge: 0,
        expires: new Date(0),
      })

      return nextResponse
    }

    return NextResponse.redirect(
      new URL(
        `${SITE_URL}/checkout?error=payment_failed&ref=${body.MerchantReference}&resultCode=${body.ResultCode}&resultDescription=${body.ResultDescription}`,
      ),
    )
  } catch (error) {
    console.error("Piraeus Bank success API error:", error)
    return NextResponse.redirect(
      new URL(`${SITE_URL}/checkout?error=payment_failed`),
    )
  }
}

/**
 * GET /api/checkout/piraeus-bank/success
 *
 * Handle GET callbacks from bank
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const body = {
      ResultCode: searchParams.get("ResultCode"),
      ResultDescription: searchParams.get("ResultDescription"),
      StatusFlag: searchParams.get("StatusFlag"),
      ResponseCode: searchParams.get("ResponseCode"),
      ResponseDescription: searchParams.get("ResponseDescription"),
      MerchantReference: searchParams.get("MerchantReference"),
      TransactionId: searchParams.get("TransactionId"),
      SupportReferenceID: searchParams.get("SupportReferenceID"),
      PackageNo: searchParams.get("PackageNo"),
      AuthStatus: searchParams.get("AuthStatus"),
      ApprovalCode: searchParams.get("ApprovalCode"),
      HashKey: searchParams.get("HashKey"),
      Parameters: searchParams.get("Parameters"),
    }

    if (!body.MerchantReference) {
      return NextResponse.redirect(
        new URL(`${SITE_URL}/checkout?error=missing_reference`),
      )
    }

    const response = await processPiraeusBankSuccess(body as any)

    if (response.success && response.order_id) {
      return NextResponse.redirect(
        new URL(`${SITE_URL}/order/${response.order_id}/confirmed`),
      )
    }

    return NextResponse.redirect(
      new URL(
        `${SITE_URL}/checkout?error=payment_failed&ref=${body.MerchantReference}`,
      ),
    )
  } catch (error) {
    console.error("Piraeus Bank success API error (GET):", error)
    return NextResponse.redirect(
      new URL(`${SITE_URL}/checkout?error=payment_failed`),
    )
  }
}

// import { NextRequest, NextResponse } from "next/server"
// import { processPiraeusBankSuccess } from "@lib/data/piraeus-bank"
//
// /**
//  * POST /api/checkout/piraeus-bank/success
//  *
//  * Processes Piraeus Bank payment callback (form-encoded POST from bank)
//  */
// export async function POST(request: NextRequest) {
//   try {
//     // Bank sends form-encoded data, not JSON
//     const formData = await request.formData()
//
//     const body = {
//       ResultCode: formData.get("ResultCode") as string,
//       ResultDescription: formData.get("ResultDescription") as string,
//       StatusFlag: formData.get("StatusFlag") as string,
//       ResponseCode: formData.get("ResponseCode") as string,
//       ResponseDescription: formData.get("ResponseDescription") as string,
//       MerchantReference: formData.get("MerchantReference") as string,
//       TransactionId: formData.get("TransactionId") as string,
//       SupportReferenceID: formData.get("SupportReferenceID") as string,
//       PackageNo: formData.get("PackageNo") as string,
//       AuthStatus: formData.get("AuthStatus") as string,
//       ApprovalCode: formData.get("ApprovalCode") as string,
//       HashKey: formData.get("HashKey") as string,
//       Parameters: formData.get("Parameters") as string,
//     }
//
//     if (!body.MerchantReference) {
//       return NextResponse.redirect(
//         new URL("/checkout?error=missing_reference", request.url)
//       )
//     }
//
//     const response = await processPiraeusBankSuccess(body)
//
//     if (response.success && response.order_id) {
//       return NextResponse.redirect(
//         new URL(`/order/${response.order_id}/confirmed`, request.url)
//       )
//     }
//
//     return NextResponse.redirect(
//       new URL(
//         `/checkout?error=payment_failed&ref=${body.MerchantReference}`,
//         request.url
//       )
//     )
//   } catch (error) {
//     console.error("Piraeus Bank success API error:", error)
//     return NextResponse.redirect(
//       new URL("/checkout?error=payment_failed", request.url)
//     )
//   }
// }
//
// /**
//  * GET /api/checkout/piraeus-bank/success
//  *
//  * Handle GET callbacks from bank
//  */
// export async function GET(request: NextRequest) {
//   try {
//     const searchParams = request.nextUrl.searchParams
//
//     const body = {
//       ResultCode: searchParams.get("ResultCode"),
//       ResultDescription: searchParams.get("ResultDescription"),
//       StatusFlag: searchParams.get("StatusFlag"),
//       ResponseCode: searchParams.get("ResponseCode"),
//       ResponseDescription: searchParams.get("ResponseDescription"),
//       MerchantReference: searchParams.get("MerchantReference"),
//       TransactionId: searchParams.get("TransactionId"),
//       SupportReferenceID: searchParams.get("SupportReferenceID"),
//       PackageNo: searchParams.get("PackageNo"),
//       AuthStatus: searchParams.get("AuthStatus"),
//       ApprovalCode: searchParams.get("ApprovalCode"),
//       HashKey: searchParams.get("HashKey"),
//       Parameters: searchParams.get("Parameters"),
//     }
//
//     if (!body.MerchantReference) {
//       return NextResponse.redirect(
//         new URL("/checkout?error=missing_reference", request.url)
//       )
//     }
//
//     const response = await processPiraeusBankSuccess(body as any)
//
//     if (response.success && response.order_id) {
//       return NextResponse.redirect(
//         new URL(`/order/${response.order_id}/confirmed`, request.url)
//       )
//     }
//
//     return NextResponse.redirect(
//       new URL(
//         `/checkout?error=payment_failed&ref=${body.MerchantReference}`,
//         request.url
//       )
//     )
//   } catch (error) {
//     console.error("Piraeus Bank success API error (GET):", error)
//     return NextResponse.redirect(
//       new URL("/checkout?error=payment_failed", request.url)
//     )
//   }
// }
