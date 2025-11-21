import crypto from 'crypto'

const ALGORITHM = 'aes-256-cbc'
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-32-char-key-for-dev-only!'

/**
 * Get encryption key as a 32-byte buffer
 */
function getEncryptionKey(): Buffer {
  return Buffer.from(ENCRYPTION_KEY.slice(0, 32))
}

/**
 * Encrypts a plaintext string using AES-256-CBC
 * @param text - The plaintext to encrypt
 * @returns Encrypted text in format: iv:encryptedData
 */
export function encrypt(text: string): string {
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16)

  // Create cipher with key and IV
  const cipher = crypto.createCipheriv(ALGORITHM, getEncryptionKey(), iv)

  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  // Return IV and encrypted data joined by ':'
  return `${iv.toString('hex')}:${encrypted}`
}

/**
 * Decrypts an encrypted string
 * @param encryptedText - The encrypted text in format: iv:encryptedData
 * @returns Decrypted plaintext
 * @throws Error if decryption fails
 */
export function decrypt(encryptedText: string): string {
  try {
    // Split IV and encrypted data
    const parts = encryptedText.split(':')

    if (parts.length !== 2) {
      throw new Error('Invalid encrypted text format')
    }

    const iv = Buffer.from(parts[0], 'hex')
    const encryptedData = parts[1]

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, getEncryptionKey(), iv)

    // Decrypt the data
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    throw new Error(`Decryption failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
