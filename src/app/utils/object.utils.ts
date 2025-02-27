export function firstNonNull<T>(a: T, b: T): T {
  if (!isNullOrUndefined(a)) {
    return a;
  }
  if (!isNullOrUndefined(b)) {
    return b;
  }
  throw new Error('At least one non null element is required');
}

export function isNullOrUndefined(value: any): boolean {
  return (value === null || value === undefined);
}

export function trimToNull(text: string | null | undefined): string | null {
  if (isNullOrUndefined(text)) {
    return null;
  }
  const trimmedString: string = `${text}`.trim();
  return trimmedString.length <= 0 ? null : trimmedString;
}

export function isNullOrEmpty(text: string | null | undefined): boolean {
  const trimmedText: string | null = trimToNull(text);
  return isNullOrUndefined(trimmedText);
}

