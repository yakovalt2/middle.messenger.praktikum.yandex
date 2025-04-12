function isEqual(a: object, b: object): boolean {
  if (a === null || b === null) {
    throw new Error("Both arguments must be non-null objects");
  }

  if (a === b) return true;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    const valueA = (a as Record<string, unknown>)[key];
    const valueB = (b as Record<string, unknown>)[key];

    if (!keysB.includes(key) || !isEqualValue(valueA, valueB)) {
      return false;
    }
  }

  return true;
}

function isEqualValue(a: unknown, b: unknown): boolean {
  if (
    typeof a === "object" &&
    a !== null &&
    typeof b === "object" &&
    b !== null
  ) {
    return isEqual(a as object, b as object);
  }
  return a === b;
}

export default isEqual;
