export async function POST(req: Request) {
  const body = await req.json()

  const phoneNumberId = process.env.PHONE_NUMBER_ID
  const accessToken = process.env.WHATSAPP_TOKEN

  if (!phoneNumberId || !accessToken) {
    console.error('WhatsApp env vars missing: PHONE_NUMBER_ID / WHATSAPP_TOKEN')
    return Response.json({ success: false, error: 'WhatsApp not configured' }, { status: 500 })
  }

  await fetch(
    `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: body.phone,
        type: 'text',
        text: {
          body: body.message,
        },
      }),
    }
  )

  return Response.json({ success: true })
}
