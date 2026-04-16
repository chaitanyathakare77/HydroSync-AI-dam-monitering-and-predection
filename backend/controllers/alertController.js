import { sendBulkWhatsAppAlerts } from "../services/whatsappService.js"

export const sendDamAlert = async (req, res) => {
  try {
    const { phoneNumbers, alertMessage, waterLevel } = req.body

    if (!phoneNumbers || phoneNumbers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No phone numbers provided",
      })
    }

    if (!alertMessage) {
      return res.status(400).json({
        success: false,
        message: "Alert message is required",
      })
    }

    // Send WhatsApp alerts to all villagers
    const results = await sendBulkWhatsAppAlerts(phoneNumbers, alertMessage)

    const successCount = results.filter((r) => r.success).length
    const failureCount = results.filter((r) => !r.success).length

    res.json({
      success: true,
      message: "Alert sent to villagers",
      waterLevel: waterLevel || null,
      totalRecipients: phoneNumbers.length,
      successCount,
      failureCount,
      results,
    })
  } catch (error) {
    console.error("Error sending dam alert:", error)
    res.status(500).json({
      success: false,
      message: "Failed to send alert",
      error: error.message,
    })
  }
}
