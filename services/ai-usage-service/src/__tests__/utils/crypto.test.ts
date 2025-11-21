import { encrypt, decrypt } from '../../utils/crypto'

describe('Crypto Utilities', () => {
  describe('encrypt', () => {
    it('encrypts text and returns different value', () => {
      const plainText = 'sk-ant-api03-test-key-12345'
      const encrypted = encrypt(plainText)

      expect(encrypted).toBeDefined()
      expect(encrypted).not.toBe(plainText)
      expect(encrypted.length).toBeGreaterThan(0)
    })

    it('produces different output for same input on different calls', () => {
      const plainText = 'sk-ant-api03-test-key-12345'
      const encrypted1 = encrypt(plainText)
      const encrypted2 = encrypt(plainText)

      // Should be different due to random IV
      expect(encrypted1).not.toBe(encrypted2)
    })

    it('handles empty string', () => {
      const encrypted = encrypt('')
      expect(encrypted).toBeDefined()
      expect(encrypted.length).toBeGreaterThan(0)
    })
  })

  describe('decrypt', () => {
    it('decrypts encrypted text correctly', () => {
      const plainText = 'sk-ant-api03-test-key-12345'
      const encrypted = encrypt(plainText)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plainText)
    })

    it('decrypts empty string correctly', () => {
      const plainText = ''
      const encrypted = encrypt(plainText)
      const decrypted = decrypt(encrypted)

      expect(decrypted).toBe(plainText)
    })

    it('throws error on invalid encrypted text', () => {
      expect(() => decrypt('invalid-encrypted-text')).toThrow()
    })

    it('throws error on malformed input', () => {
      expect(() => decrypt('not:enough:parts')).toThrow()
    })
  })
})
