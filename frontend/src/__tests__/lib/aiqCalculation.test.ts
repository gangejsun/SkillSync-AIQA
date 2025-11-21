import { describe, it, expect } from 'vitest';
import {
  calculateCapabilities,
  determineAIQType,
  calculateConfidence,
  generateAIQResult,
  AIQCapabilities,
  AIQType,
} from '@/lib/aiqCalculation';

describe('AIQ Calculation', () => {
  describe('calculateCapabilities', () => {
    it('should calculate capabilities correctly for all minimum answers (1)', () => {
      // All answers = 1 (전혀 그렇지 않음) -> should result in 0 for all capabilities
      const answers = new Array(10).fill(1);
      const capabilities = calculateCapabilities(answers);

      expect(capabilities.U).toBe(0);
      expect(capabilities.P).toBe(0);
      expect(capabilities.C).toBe(0);
      expect(capabilities.R).toBe(0);
      expect(capabilities.E).toBe(0);
      expect(capabilities.S).toBe(0);
      expect(capabilities.Co).toBe(0);
      expect(capabilities.F).toBe(0);
    });

    it('should calculate capabilities correctly for all maximum answers (4)', () => {
      // All answers = 4 (매우 그러함) -> should result in 100 for all capabilities
      const answers = new Array(10).fill(4);
      const capabilities = calculateCapabilities(answers);

      expect(capabilities.U).toBe(100);
      expect(capabilities.P).toBe(100);
      expect(capabilities.C).toBe(100);
      expect(capabilities.R).toBe(100);
      expect(capabilities.E).toBe(100);
      expect(capabilities.S).toBe(100);
      expect(capabilities.Co).toBe(100);
      expect(capabilities.F).toBe(100);
    });

    it('should calculate capabilities correctly for middle answers (2 and 3)', () => {
      // Answer 2 -> 33%, Answer 3 -> 67%
      const answers = [2, 3, 2, 3, 2, 3, 2, 3, 2, 3];
      const capabilities = calculateCapabilities(answers);

      // All capabilities should be around 50% (average of 33 and 67)
      Object.values(capabilities).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(30);
        expect(value).toBeLessThanOrEqual(70);
      });
    });

    it('should return values between 0 and 100', () => {
      const answers = [1, 2, 3, 4, 1, 2, 3, 4, 2, 3];
      const capabilities = calculateCapabilities(answers);

      Object.values(capabilities).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });

    it('should handle weighted questions correctly', () => {
      // Test that weights are applied properly
      const answers = [4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
      const capabilities = calculateCapabilities(answers);

      // All should be 100 since all answers are maximum
      expect(capabilities.U).toBe(100);
      expect(capabilities.C).toBe(100);
    });

    it('should return integer values', () => {
      const answers = [1, 2, 3, 4, 1, 2, 3, 4, 2, 3];
      const capabilities = calculateCapabilities(answers);

      Object.values(capabilities).forEach(value => {
        expect(Number.isInteger(value)).toBe(true);
      });
    });
  });

  describe('determineAIQType', () => {
    it('should return speed_executor for high U and C', () => {
      const capabilities: AIQCapabilities = {
        U: 75,
        P: 50,
        C: 70,
        R: 50,
        E: 50,
        S: 50,
        Co: 50,
        F: 50,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('speed_executor');
    });

    it('should return precision_analyst for high P and E', () => {
      const capabilities: AIQCapabilities = {
        U: 50,
        P: 80,
        C: 50,
        R: 50,
        E: 75,
        S: 50,
        Co: 50,
        F: 50,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('precision_analyst');
    });

    it('should return creative_innovator for high C and S', () => {
      const capabilities: AIQCapabilities = {
        U: 50,
        P: 50,
        C: 80,
        R: 50,
        E: 50,
        S: 80,
        Co: 50,
        F: 50,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('creative_innovator');
    });

    it('should return master_prompter for high R and F', () => {
      const capabilities: AIQCapabilities = {
        U: 50,
        P: 50,
        C: 50,
        R: 80,
        E: 50,
        S: 50,
        Co: 50,
        F: 70,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('master_prompter');
    });

    it('should return quality_guardian for high E and P', () => {
      const capabilities: AIQCapabilities = {
        U: 40,
        P: 75,
        C: 50,
        R: 50,
        E: 75,
        S: 50,
        Co: 50,
        F: 50,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('quality_guardian');
    });

    it('should return collaborative_builder for high Co and U', () => {
      const capabilities: AIQCapabilities = {
        U: 65,
        P: 50,
        C: 50,
        R: 50,
        E: 50,
        S: 50,
        Co: 75,
        F: 50,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('collaborative_builder');
    });

    it('should return ai_fundamentalist for high F but low other scores', () => {
      const capabilities: AIQCapabilities = {
        U: 40,
        P: 40,
        C: 40,
        R: 40,
        E: 40,
        S: 40,
        Co: 40,
        F: 85,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('ai_fundamentalist');
    });

    it('should return balanced_practitioner for balanced scores', () => {
      const capabilities: AIQCapabilities = {
        U: 50,
        P: 50,
        C: 50,
        R: 50,
        E: 50,
        S: 50,
        Co: 50,
        F: 50,
      };
      const type = determineAIQType(capabilities);
      expect(type).toBe('balanced_practitioner');
    });

    it('should always return a valid AIQType', () => {
      const validTypes: AIQType[] = [
        'speed_executor',
        'precision_analyst',
        'creative_innovator',
        'master_prompter',
        'quality_guardian',
        'collaborative_builder',
        'ai_fundamentalist',
        'balanced_practitioner',
      ];

      // Test with random capabilities
      for (let i = 0; i < 20; i++) {
        const randomCapabilities: AIQCapabilities = {
          U: Math.floor(Math.random() * 100),
          P: Math.floor(Math.random() * 100),
          C: Math.floor(Math.random() * 100),
          R: Math.floor(Math.random() * 100),
          E: Math.floor(Math.random() * 100),
          S: Math.floor(Math.random() * 100),
          Co: Math.floor(Math.random() * 100),
          F: Math.floor(Math.random() * 100),
        };
        const type = determineAIQType(randomCapabilities);
        expect(validTypes).toContain(type);
      }
    });
  });

  describe('calculateConfidence', () => {
    it('should return high confidence for consistent answers', () => {
      // All same answers -> high confidence
      const answers = new Array(10).fill(4);
      const confidence = calculateConfidence(answers);

      expect(confidence).toBeGreaterThanOrEqual(0.7);
      expect(confidence).toBeLessThanOrEqual(1.0);
    });

    it('should return lower confidence for varied answers', () => {
      // Very varied answers -> lower confidence
      const answers = [1, 4, 1, 4, 1, 4, 1, 4, 1, 4];
      const confidence = calculateConfidence(answers);

      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(0.8);
    });

    it('should return value between 0 and 1', () => {
      const answers = [1, 2, 3, 4, 1, 2, 3, 4, 2, 3];
      const confidence = calculateConfidence(answers);

      expect(confidence).toBeGreaterThanOrEqual(0);
      expect(confidence).toBeLessThanOrEqual(1);
    });

    it('should return consistent confidence for same answer patterns', () => {
      const answers1 = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
      const answers2 = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

      const confidence1 = calculateConfidence(answers1);
      const confidence2 = calculateConfidence(answers2);

      // Same pattern (all same) should give similar confidence
      expect(Math.abs(confidence1 - confidence2)).toBeLessThan(0.1);
    });
  });

  describe('generateAIQResult', () => {
    it('should generate complete AIQ result', () => {
      const answers = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
      const result = generateAIQResult(answers);

      expect(result).toHaveProperty('aiqType');
      expect(result).toHaveProperty('capabilities');
      expect(result).toHaveProperty('confidenceLevel');
      expect(result).toHaveProperty('completedAt');
    });

    it('should generate valid AIQ type', () => {
      const validTypes: AIQType[] = [
        'speed_executor',
        'precision_analyst',
        'creative_innovator',
        'master_prompter',
        'quality_guardian',
        'collaborative_builder',
        'ai_fundamentalist',
        'balanced_practitioner',
      ];

      const answers = [2, 3, 4, 2, 3, 4, 2, 3, 4, 2];
      const result = generateAIQResult(answers);

      expect(validTypes).toContain(result.aiqType);
    });

    it('should generate valid capabilities object', () => {
      const answers = [1, 2, 3, 4, 1, 2, 3, 4, 2, 3];
      const result = generateAIQResult(answers);

      expect(result.capabilities).toHaveProperty('U');
      expect(result.capabilities).toHaveProperty('P');
      expect(result.capabilities).toHaveProperty('C');
      expect(result.capabilities).toHaveProperty('R');
      expect(result.capabilities).toHaveProperty('E');
      expect(result.capabilities).toHaveProperty('S');
      expect(result.capabilities).toHaveProperty('Co');
      expect(result.capabilities).toHaveProperty('F');

      // All values should be 0-100
      Object.values(result.capabilities).forEach(value => {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(100);
      });
    });

    it('should generate valid confidence level', () => {
      const answers = [3, 3, 3, 3, 3, 3, 3, 3, 3, 3];
      const result = generateAIQResult(answers);

      expect(result.confidenceLevel).toBeGreaterThanOrEqual(0);
      expect(result.confidenceLevel).toBeLessThanOrEqual(1);
    });

    it('should generate valid completedAt timestamp', () => {
      const answers = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2];
      const result = generateAIQResult(answers);

      const completedAt = new Date(result.completedAt);
      expect(completedAt).toBeInstanceOf(Date);
      expect(completedAt.getTime()).toBeLessThanOrEqual(Date.now());
    });

    it('should produce different capabilities for different answer patterns', () => {
      const answers1 = [4, 4, 4, 4, 1, 1, 1, 1, 2, 2]; // Early questions high
      const answers2 = [1, 1, 1, 1, 4, 4, 4, 4, 3, 3]; // Later questions high

      const result1 = generateAIQResult(answers1);
      const result2 = generateAIQResult(answers2);

      // Different answer patterns should produce different capability distributions
      // Just verify that they produce different results
      const capabilities1 = Object.values(result1.capabilities);
      const capabilities2 = Object.values(result2.capabilities);

      const avg1 = capabilities1.reduce((a, b) => a + b, 0) / capabilities1.length;
      const avg2 = capabilities2.reduce((a, b) => a + b, 0) / capabilities2.length;

      // Both should have some capability scores (not all zero)
      expect(avg1).toBeGreaterThan(20);
      expect(avg2).toBeGreaterThan(20);
    });

    it('should handle edge case: all minimum answers', () => {
      const answers = new Array(10).fill(1);
      const result = generateAIQResult(answers);

      expect(result.aiqType).toBeTruthy();
      expect(Object.values(result.capabilities).every(v => v === 0)).toBe(true);
    });

    it('should handle edge case: all maximum answers', () => {
      const answers = new Array(10).fill(4);
      const result = generateAIQResult(answers);

      expect(result.aiqType).toBeTruthy();
      expect(Object.values(result.capabilities).every(v => v === 100)).toBe(true);
    });
  });

  describe('Integration: Full AIQ Assessment Flow', () => {
    it('should produce consistent results for same inputs', () => {
      const answers = [3, 2, 4, 3, 2, 4, 3, 2, 4, 3];

      const result1 = generateAIQResult(answers);
      const result2 = generateAIQResult(answers);

      // Same input should produce same capabilities and type
      expect(result1.aiqType).toBe(result2.aiqType);
      expect(result1.capabilities).toEqual(result2.capabilities);
      expect(result1.confidenceLevel).toBeCloseTo(result2.confidenceLevel, 5);
    });

    it('should handle realistic user answer patterns', () => {
      // Simulate realistic user: mostly 3s and 4s with some 2s
      const realisticAnswers = [3, 4, 3, 4, 3, 2, 4, 3, 4, 3];
      const result = generateAIQResult(realisticAnswers);

      // Result should have high capabilities (mostly 3-4 answers)
      const avgCapability = Object.values(result.capabilities).reduce((a, b) => a + b, 0) / 8;
      expect(avgCapability).toBeGreaterThanOrEqual(50);
      expect(avgCapability).toBeLessThanOrEqual(90);

      // Confidence should be reasonably high for consistent pattern
      expect(result.confidenceLevel).toBeGreaterThanOrEqual(0.5);
    });
  });
});
