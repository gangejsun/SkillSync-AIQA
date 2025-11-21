'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

type AIProvider = 'claude_code' | 'cursor' | 'github_copilot'

interface ToolOption {
  id: AIProvider
  name: string
  description: string
  icon: string
  keyFormat: string
  placeholder: string
}

const toolOptions: ToolOption[] = [
  {
    id: 'claude_code',
    name: 'Claude Code',
    description: 'Track your Claude Code usage and interactions',
    icon: '🤖',
    keyFormat: 'sk-ant-api03-...',
    placeholder: 'sk-ant-api03-your-key-here',
  },
  {
    id: 'github_copilot',
    name: 'GitHub Copilot',
    description: 'Monitor your GitHub Copilot completions',
    icon: '🐙',
    keyFormat: 'ghp_...',
    placeholder: 'ghp_your-github-token-here',
  },
  {
    id: 'cursor',
    name: 'Cursor AI',
    description: 'Track your Cursor AI editor usage',
    icon: '✨',
    keyFormat: 'cursor_api_...',
    placeholder: 'cursor_api_your-key-here',
  },
]

export default function ConnectToolPage() {
  const router = useRouter()
  const [selectedTool, setSelectedTool] = useState<AIProvider | null>(null)
  const [apiKey, setApiKey] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedTool || !apiKey) {
      setError('Please select a tool and enter an API key')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/ai-usage/connect', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ provider: selectedTool, api_key: apiKey }),
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
      setTimeout(() => {
        router.push('/ai-usage')
      }, 2000)
    } catch (err) {
      setError('Failed to connect. Please check your API key and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/ai-usage')}
            className="text-indigo-600 hover:text-indigo-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Connect AI Tool
          </h1>
          <p className="text-gray-600">
            Connect your AI development tools to start tracking usage
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-900 mb-2">
              Successfully Connected!
            </h2>
            <p className="text-green-700">
              Redirecting to dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* Tool Selection */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Step 1: Select Your Tool
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {toolOptions.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setSelectedTool(tool.id)
                      setError('')
                    }}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTool === tool.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{tool.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600">{tool.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            {selectedTool && (
              <form onSubmit={handleConnect}>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Step 2: Enter API Key
                  </h2>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      API Key / Token
                    </label>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={(e) => {
                        setApiKey(e.target.value)
                        setError('')
                      }}
                      placeholder={
                        toolOptions.find((t) => t.id === selectedTool)
                          ?.placeholder
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Format: {toolOptions.find((t) => t.id === selectedTool)?.keyFormat}
                    </p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      ℹ️ Development Mode
                    </h4>
                    <p className="text-sm text-blue-800">
                      Currently in UI development mode. API key validation only - no data storage or fetching yet.
                      Full integration will be implemented in the next phase.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {isLoading ? 'Connecting...' : 'Connect Tool'}
                  </button>
                </div>
              </form>
            )}

            {/* How to Get API Keys */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                How to Get Your API Keys
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🤖 Claude Code
                  </h3>
                  <p className="text-sm text-gray-600">
                    Visit{' '}
                    <a
                      href="https://console.anthropic.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      console.anthropic.com
                    </a>{' '}
                    and create an API key
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    🐙 GitHub Copilot
                  </h3>
                  <p className="text-sm text-gray-600">
                    Generate a Personal Access Token at{' '}
                    <a
                      href="https://github.com/settings/tokens"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:underline"
                    >
                      github.com/settings/tokens
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    ✨ Cursor AI
                  </h3>
                  <p className="text-sm text-gray-600">
                    Find your API key in Cursor Settings → AI Settings
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
