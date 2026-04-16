import twilio from "twilio"

const createTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN

  if (!accountSid || !authToken) {
    throw new Error(
      "Twilio credentials are missing. Set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in backend/.env"
    )
  }

  return twilio(accountSid, authToken)
}

export const sendWhatsAppAlert = async (villagerPhoneNumber, alertMessage) => {
  try {
    const client = createTwilioClient()

    const message = await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: `whatsapp:+91${villagerPhoneNumber}`,
      body: alertMessage,
    })

    console.log(`WhatsApp sent to +91${villagerPhoneNumber}: ${message.sid}`)
    return { success: true, messageSid: message.sid }
  } catch (error) {
    console.error(
      `Failed to send WhatsApp to +91${villagerPhoneNumber}:`,
      error.message
    )
    return { success: false, error: error.message }
  }
}

export const sendBulkWhatsAppAlerts = async (phoneNumbers, alertMessage) => {
  const results = []

  for (const phone of phoneNumbers) {
    const result = await sendWhatsAppAlert(phone, alertMessage)
    results.push({
      phone,
      ...result,
    })
  }

  return results
}
