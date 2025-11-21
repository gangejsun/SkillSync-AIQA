import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { connectAITool } from '../controllers/usage.controller'

const router = Router()

/**
 * POST /api/ai-usage/connect
 * Store encrypted API key for AI tool
 */
router.post('/connect', authMiddleware, connectAITool)

export default router
