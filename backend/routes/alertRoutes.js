import express from "express"
import { sendDamAlert } from "../controllers/alertController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Protected route - only authenticated users can send alerts
router.post("/send-dam-alert", protect, sendDamAlert)

export default router
