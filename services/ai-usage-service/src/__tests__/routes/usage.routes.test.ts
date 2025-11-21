import request from 'supertest'
import express, { Express } from 'express'
import usageRoutes from '../../routes/usage.routes'

describe('POST /api/ai-usage/connect', () => {
  let app: Express

  beforeEach(() => {
    // Clear mock calls
    jest.clearAllMocks()

    // Setup express app
    app = express()
    app.use(express.json())
    app.use('/api/ai-usage', usageRoutes)
  })

  describe('Authentication', () => {
    it('returns 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .send({
          provider: 'claude_code',
          api_key: 'sk-ant-api03-test-key',
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })

    it('returns 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          provider: 'claude_code',
          api_key: 'sk-ant-api03-test-key',
        })
        .expect(401)

      expect(response.body).toHaveProperty('error')
    })
  })

  describe('Validation', () => {
    it('returns 400 for missing provider', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          api_key: 'sk-ant-api03-test-key',
        })
        .expect(400)

      expect(response.body.error).toContain('provider')
    })

    it('returns 400 for invalid provider', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          provider: 'invalid_provider',
          api_key: 'sk-ant-api03-test-key',
        })
        .expect(400)

      expect(response.body.error).toContain('provider')
    })

    it('returns 400 for missing api_key', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          provider: 'claude_code',
        })
        .expect(400)

      expect(response.body.error).toContain('api_key')
    })

    it('returns 400 for invalid Claude API key format', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          provider: 'claude_code',
          api_key: 'invalid-format',
        })
        .expect(400)

      expect(response.body.error).toContain('API key format')
    })
  })

  describe('Success Cases - Validation Only', () => {
    it('validates and accepts Claude Code API keys', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          provider: 'claude_code',
          api_key: 'sk-ant-api03-valid-test-key-12345',
        })
        .expect(201)

      expect(response.body).toHaveProperty('success', true)
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('provider', 'claude_code')
    })

    it('validates and accepts GitHub Copilot tokens', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          provider: 'github_copilot',
          api_key: 'ghp_validGitHubPersonalAccessToken',
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.provider).toBe('github_copilot')
    })

    it('validates and accepts Cursor API keys', async () => {
      const response = await request(app)
        .post('/api/ai-usage/connect')
        .set('Authorization', 'Bearer valid-test-token')
        .send({
          provider: 'cursor',
          api_key: 'cursor_api_key_12345',
        })
        .expect(201)

      expect(response.body.success).toBe(true)
      expect(response.body.provider).toBe('cursor')
    })
  })
})
