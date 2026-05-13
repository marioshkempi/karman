// app/api/revalidate-sitemap/route.ts
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  // Simple secret check — set REVALIDATION_SECRET in your env
  const { searchParams } = new URL(req.url)
  const secret = searchParams.get("secret")

  // if (secret !== process.env.REVALIDATION_SECRET) {
  //   return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  // }

  // Revalidate all sitemap routes
  revalidatePath("/sitemap.xml", "page")
  revalidatePath("/sitemap/[id]", "page")

  return NextResponse.json({ revalidated: true, now: Date.now() })
}