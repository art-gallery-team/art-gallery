import { describe, expect, it } from 'vitest';
import { sum } from './math';

describe('sum function', () => {
  it('should add two numbers correctly', () => {
    expect(sum(2, 3)).toBe(5);
  });
});
