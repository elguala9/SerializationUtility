
/**
 * Recognizes and preserves TypedArray / DataView instances
 */
function fixObject(obj: any): any {
  // 1) If it's already a binary view (Uint8Array, DataView, etc.)
  if (ArrayBuffer.isView(obj)) {
    return obj;
  }
  // 2) If it's a raw ArrayBuffer, wrap it in a Uint8Array
  if (obj instanceof ArrayBuffer) {
    return new Uint8Array(obj);
  }
  // 3) For arrays, apply recursion
  if (Array.isArray(obj)) {
    return obj.map(fixObject);
  }
  // 4) For plain objects, apply recursion on each property
  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const key in obj) {
      out[key] = fixObject(obj[key]);
    }
    return out;
  }
  // 5) Otherwise, return primitive values unchanged
  return obj;
}

/**
 * Normalizes an object by converting ArrayBuffers to Uint8Arrays and
 * removing undefined values from objects and arrays
 */
function normalizeForSerialization(obj: any): any {
  // 1) Preserve binary views as-is
  if (ArrayBuffer.isView(obj)) return obj;
  // 2) Convert raw ArrayBuffer to Uint8Array
  if (obj instanceof ArrayBuffer) return new Uint8Array(obj);

  // 3) Process arrays: skip undefined elements and recurse
  if (Array.isArray(obj)) {
    const result: any[] = [];
    for (const element of obj) {
      if (element === undefined) continue; // drop undefined elements
      result.push(normalizeForSerialization(element));
    }
    return result;
  }

  // 4) Process plain objects: drop undefined properties and recurse
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value === undefined) continue; // drop undefined props
      result[key] = normalizeForSerialization(value);
    }
    return result;
  }

  // 5) Return primitive values (string, number, boolean, null)
  return obj;
}

/**
 * Serializes an object to a Uint8Array using JSON after normalizing it.
 *
 * @param obj The object to serialize.
 * @returns A Uint8Array representing the serialized JSON.
 */
export function serializeObject(obj: any): Uint8Array {
  const normalized = normalizeForSerialization(obj);
  const json = JSON.stringify(normalized);
  return new TextEncoder().encode(json);
}

/**
 * Deserializes a Uint8Array back into an object using JSON.parse.
 *
 * @param data The Uint8Array to deserialize.
 * @returns The deserialized object.
 */
export function deserializeObject<T = any>(data: Uint8Array): T {
  const json = new TextDecoder().decode(data);
  return JSON.parse(json) as T;
}

/**
 * Converts an object to an ArrayBuffer
 *
 * @param obj The object to serialize.
 * @returns The serialized ArrayBuffer.
 */
export function objectToArrayBuffer(obj: any): ArrayBuffer {
  const fixedObj = fixObject(obj);
  const uint8Array = serializeObject(fixedObj);  // view on the internal ArrayBuffer
  const { byteOffset, byteLength, buffer } = uint8Array;

  // Return a sliced ArrayBuffer for the exact region
  return buffer.slice(byteOffset, byteOffset + byteLength);
}

/**
 * Converts an ArrayBuffer back into an object
 *
 * @param buffer The ArrayBuffer to deserialize.
 * @returns The deserialized object.
 */
export function arrayBufferToObject<T>(buffer: ArrayBuffer): T {
  const uint8Array = new Uint8Array(buffer); // wrap buffer in Uint8Array
  const obj = deserializeObject(uint8Array);           // decode to object

  return obj as T;
}
