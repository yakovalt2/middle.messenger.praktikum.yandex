type StringIndexed = Record<string, any>;

export type Indexed<T = any> = {
  [key: string]: T;
};

export const utils = {
  isEqual,
  queryStringify,
  set
};

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

function queryStringify(data: StringIndexed): string | never {
  if (typeof data !== "object") {
    throw new Error("Data must be object");
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    const value = data[key];
    const endLine = index < keys.length - 1 ? "&" : "";

    if (Array.isArray(value)) {
      const arrayValue = value.reduce<StringIndexed>(
        (result, arrData, index) => ({
          ...result,
          [`${key}[${index}]`]: arrData,
        }),
        {}
      );

      return `${result}${queryStringify(arrayValue)}${endLine}`;
    }

    if (typeof value === "object") {
      const objValue = Object.keys(value || {}).reduce<StringIndexed>(
        (result, objKey) => ({
          ...result,
          [`${key}[${objKey}]`]: value[objKey],
        }),
        {}
      );

      return `${result}${queryStringify(objValue)}${endLine}`;
    }

    return `${result}${key}=${value}${endLine}`;
  }, "");
}

function set(
  object: Indexed | unknown,
  path: string,
  value: unknown
): Indexed | unknown {
  console.log(path);

  if (typeof path !== "string") {
    throw new Error("path must be string");
  }

  if (typeof object !== "object" || object === null) {
    return object;
  }

  const keys = path.split(".");
  let current = object as Indexed;

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    if (i === keys.length - 1) {
      current[key] = value;
    } else {
      if (typeof current[key] !== "object" || current[key] === null) {
        current[key] = {};
      }
      current = current[key] as Indexed;
    }
  }

  return object;
}
