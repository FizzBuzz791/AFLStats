/**
 * JSON replacer that can handle Map objects.
 */
export function replacerWithMap(_key: unknown, value: unknown) {
  if (value instanceof Map) {
    return {
      dataType: "Map",
      value: Array.from(value.entries()),
    };
  } else {
    return value;
  }
}

/**
 * JSON reviver that can handle Map objects.
 */
export function reviverWithMap(_key: unknown, value: unknown) {
  if (typeof value === "object" && value !== null && "dataType" in value) {
    if (
      value.dataType === "Map" &&
      "value" in value &&
      value.value instanceof Array
    ) {
      return new Map(value.value);
    }
  }
  return value;
}
