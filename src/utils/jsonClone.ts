// deno-lint-ignore-file no-explicit-any
export function jsonCloneReplacer(_key: any, value: any) {
  if (value && value instanceof Map) {
    return {
      __map__: Array.from(value.entries()),
    };
  }
  if (value && value instanceof Set) {
    return {
      __set__: Array.from(value),
    };
  }
  return value;
}

export function jsonCloneReviver(_key: any, value: any) {
  if (value && typeof value === "object" && "__map__" in value) {
    return new Map(value["__map__"]);
  }
  if (value && typeof value === "object" && "__set__" in value) {
    return new Set(value["__set__"]);
  }
  return value;
}

export function jsonClone<T>(value: T): T {
  if (value && "$target" in (value as any)) {
    value = (value as any).$target;
  }

  return value ? jsonParse(jsonStringify(value)) : value;
}

export function jsonParse<T>(value: string): T {
  return value ? JSON.parse(value, jsonCloneReviver) : value;
}

export function jsonStringify<T>(value: T) {
  if (value && "$target" in (value as any)) {
    value = (value as any).$target;
  }

  return value ? JSON.stringify(value, jsonCloneReplacer) : "";
}
