import {firstNonNull, isNullOrEmpty, isNullOrUndefined, trimToNull} from './object.utils';

describe('Utility Functions', () => {

  describe('firstNonNull', () => {
    test('should return the first non-null value', () => {
      expect(firstNonNull('value1', null)).toBe('value1');
      expect(firstNonNull(null, 'value2')).toBe('value2');
      expect(firstNonNull('value1', 'value2')).toBe('value1');
    });

    test('should throw an error if both values are null', () => {
      expect(() => firstNonNull(null, null)).toThrow('At least one non null element is required');
    });
  });

  describe('isNullOrUndefined', () => {
    test('should return true for null or undefined', () => {
      expect(isNullOrUndefined(null)).toBe(true);
      expect(isNullOrUndefined(undefined)).toBe(true);
    });

    test('should return false for other values', () => {
      expect(isNullOrUndefined('')).toBe(false);
      expect(isNullOrUndefined(0)).toBe(false);
      expect(isNullOrUndefined(false)).toBe(false);
      expect(isNullOrUndefined('value')).toBe(false);
    });
  });

  describe('trimToNull', () => {
    test('should return null for null or undefined', () => {
      expect(trimToNull(null)).toBe(null);
      expect(trimToNull(undefined)).toBe(null);
    });

    test('should trim whitespace and return null for empty strings', () => {
      expect(trimToNull('   ')).toBe(null);
    });

    test('should return trimmed string for non-empty strings', () => {
      expect(trimToNull('   value   ')).toBe('value');
      expect(trimToNull('value')).toBe('value');
    });
  });

  describe('isNullOrEmpty', () => {
    test('should return true for null, undefined, or empty strings', () => {
      expect(isNullOrEmpty(null)).toBe(true);
      expect(isNullOrEmpty(undefined)).toBe(true);
      expect(isNullOrEmpty('')).toBe(true);
      expect(isNullOrEmpty('   ')).toBe(true);
    });

    test('should return false for non-empty strings', () => {
      expect(isNullOrEmpty('value')).toBe(false);
      expect(isNullOrEmpty('   value   ')).toBe(false);
    });
  });

});
