import { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
  }
}

/**
 * Simple auth middleware for testing
 * In production, this would verify JWT tokens from Supabase
 */
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' })
    return
  }

  const token = authHeader.substring(7)

  // For testing: accept "valid-test-token"
  // In production: verify JWT with Supabase
  if (token === 'valid-test-token') {
    req.user = {
      id: 'test-user-id',
      email: 'test@example.com',
    }
    next()
    return
  }

  res.status(401).json({ error: 'Invalid token' })
}
