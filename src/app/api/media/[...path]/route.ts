import { NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function GET(req: Request, { params }: any) {
  const key = params.path.join("/");
  //console.log('eeee')
  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET!,
    Key: key,
  });

  try {
    const file = await s3.send(command);
    return new NextResponse(file.Body as any, {
      headers: {
        "Content-Type": file.ContentType!,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (e) {
    return new NextResponse("File not found", { status: 404 });
  }
}
