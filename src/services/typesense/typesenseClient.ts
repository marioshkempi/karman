import Typesense from "typesense"

export const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_URL || "159.69.32.175",
      port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || "8108"),
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || "",
  connectionTimeoutSeconds: 10,
})