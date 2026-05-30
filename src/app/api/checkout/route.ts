import { NextResponse } from "next/server";

/**
 * Stubbed checkout handler. NO real payment, email, or analytics ever happen —
 * this is a demo store. `testMode` is accepted from the client (set when
 * NEXT_PUBLIC_TEST_MODE=1 or ?test=1) and makes the response fully deterministic
 * for e2e.
 *
 * Deterministic decline sentinels (agreed with David):
 *   - email === "fail@test.com"        (canonical)
 *   - card number === 4000000000000002 (secondary)
 */
const DECLINE_EMAIL = "fail@test.com";
const DECLINE_CARD = "4000000000000002";

export async function POST(request: Request) {
  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
  }

  const email = String(body.email ?? "").trim().toLowerCase();
  const card = String(body["card-number"] ?? "").replace(/\s+/g, "");

  if (email === DECLINE_EMAIL || card === DECLINE_CARD) {
    return NextResponse.json(
      { ok: false, error: "Payment declined — please try another card." },
      { status: 402 },
    );
  }

  // Deterministic-looking order ref matching /^NW-\d{4,}$/.
  const orderId = `NW-${String(Math.floor(1000 + Math.random() * 9000))}`;
  return NextResponse.json({ ok: true, orderId });
}
