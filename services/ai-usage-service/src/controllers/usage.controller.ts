import { Response } from 'express'
import { AuthRequest } from '../middleware/auth'

type AIProvider = 'claude_code' | 'cursor' | 'github_copilot'

interface ConnectRequest {
  provider: AIProvider
  api_key: string
}

/**
 * Validate API key format based on provider
 */
function validateApiKeyFormat(provider: AIProvider, apiKey: string): boolean {
  switch (provider) {
    case 'claude_code':
      // Claude API keys start with sk-ant-api
      return /^sk-ant-api\d{2}-.+/.test(apiKey)
    case 'github_copilot':
      // GitHub personal access tokens start with ghp_
      return /^ghp_.+/.test(apiKey)
    case 'cursor':
      // Cursor API keys (flexible format for now)
      return apiKey.length > 10
    default:
      return false
  }
}

/**
 * POST /api/ai-usage/connect
 * Validate API key format (UI only - no data storage yet)
 */
export async function connectAITool(
  req: AuthRequest,
  res: Response
): Promise<void> {
  try {
    const { provider, api_key } = req.body as ConnectRequest

    // Validate provider
    const validProviders: AIProvider[] = ['claude_code', 'cursor', 'github_copilot']
    if (!provider || !validProviders.includes(provider)) {
      res.status(400).json({
        error: 'Invalid provider. Must be one of: claude_code, cursor, github_copilot',
      })
      return
    }

    // Validate API key presence
    if (!api_key || typeof api_key !== 'string') {
      res.status(400).json({
        error: 'api_key is required and must be a string',
      })
      return
    }

    // Validate API key format
    if (!validateApiKeyFormat(provider, api_key)) {
      res.status(400).json({
        error: `Invalid API key format for ${provider}`,
      })
      return
    }

    // TODO: Implement actual API key storage and data fetching when backend is ready
    // For now, just return success after validation
    res.status(201).json({
      success: true,
      message: 'API key validated successfully. Data storage not yet implemented.',
      provider,
    })
  } catch (error) {
    console.error('Connect AI tool error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
