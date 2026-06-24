/**
 * Service Chargily Pay (CIB / Edahabia) — création de checkout par redirection.
 * Docs : https://dev.chargily.com
 */
const MODE = process.env.CHARGILY_MODE === "live" ? "live" : "test"
const BASE_URL =
  MODE === "live"
    ? "https://pay.chargily.net/api/v2"
    : "https://pay.chargily.net/test/api/v2"

export const chargilyEnabled = () => Boolean(process.env.CHARGILY_SECRET_KEY)

type CreateCheckoutInput = {
  amount: number
  orderId: string
}

export async function createChargilyCheckout({
  amount,
  orderId,
}: CreateCheckoutInput): Promise<{ id: string; url: string }> {
  const key = process.env.CHARGILY_SECRET_KEY
  if (!key) throw new Error("CHARGILY_SECRET_KEY non configuré")

  const successUrl =
    process.env.CHARGILY_SUCCESS_URL || "http://localhost:5173/order/confirmed"
  const failureUrl =
    process.env.CHARGILY_FAILURE_URL || "http://localhost:5173/cart"

  const res = await fetch(`${BASE_URL}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount,
      currency: "dzd",
      success_url: `${successUrl}?order=${orderId}`,
      failure_url: failureUrl,
      webhook_endpoint: process.env.CHARGILY_WEBHOOK_URL || undefined,
      metadata: { order_id: orderId },
    }),
  })

  const json: any = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(
      `Chargily API error (${res.status}): ${json?.message || res.statusText}`
    )
  }

  return { id: json.id, url: json.checkout_url || json.url }
}
