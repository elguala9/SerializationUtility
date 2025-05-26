
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
 * Serializes any JavaScript object into a Uint8Array using JSON + UTF-8 encoding.
 *
 * @param obj - The object to serialize.
 * @returns A Uint8Array containing the UTF-8 encoded JSON representation of the object.
 */
export function objectToUint8Array<T>(obj: T): Uint8Array {
  const json = JSON.stringify(obj);
  const encoder = new TextEncoder();
  return encoder.encode(json);
}

/**
 * Deserializes a Uint8Array back into a JavaScript object using JSON.parse.
 *
 * @param data - The Uint8Array containing UTF-8 encoded JSON.
 * @returns The deserialized object of type T.
 */
export function uint8ArrayToObject<T>(data: Uint8Array): T {
  const decoder = new TextDecoder();
  const json = decoder.decode(data);
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
  const uint8Array = objectToUint8Array(fixedObj);  // view on the internal ArrayBuffer
  const { byteOffset, byteLength, buffer } = uint8Array;

  // Return a sliced ArrayBuffer for the exact region
  return buffer.slice(byteOffset, byteOffset + byteLength);
}

/**
 * Converts an ArrayBuffer back into an object, reconstructing any Uint8Array fields
 *
 * @param buffer The ArrayBuffer to deserialize.
 * @returns The deserialized object with TypedArrays restored.
 */
export function arrayBufferToObject<T>(buffer: ArrayBuffer): T {
  // Decode the ArrayBuffer into a UTF-8 string
  const text = new TextDecoder().decode(buffer);
  // Parse the JSON
  const parsed = JSON.parse(text) as any;

  // Iterate over object properties to restore any Uint8Array fields
  for (const [key, value] of Object.entries(parsed)) {
    if (
      value !== null &&
      typeof value === 'object' &&
      !Array.isArray(value)
    ) {
      const entries = Object.entries(value);
      // Check if all keys are consecutive numeric strings mapping to numbers
      const isNumericMap = entries.length > 0 && entries.every(
        ([k, v]) => /^[0-9]+$/.test(k) && typeof v === 'number'
      );
      if (isNumericMap) {
        // Convert numeric-keyed object to Uint8Array
        const length = entries.length;
        const arr = new Uint8Array(length);
        for (let i = 0; i < length; i++) {
          arr[i] = (value as any)[`${i}`];
        }
        parsed[key] = arr;
      }
    }
  }

  return parsed as T;
}



/**
 * Combines an array of number[] into a single number[].
 *
 * @param arrays - An array of number arrays to combine.
 * @returns A single number[] containing the concatenated data of tutti gli input.
 */
export function composeNumberArray(arrays: number[][]): number[] {
  // Calcolo la lunghezza totale
  const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);

  // Pre-allocazione
  const combined = new Array<number>(totalLength);

  let offset = 0;
  for (const arr of arrays) {
    for (let i = 0; i < arr.length; i++) {
      combined[offset + i] = arr[i];
    }
    offset += arr.length;
  }

  return combined;
}


    /**
     * Serializes an object to a number[] using JSON after normalizing it.
     *
     * @param obj The object to serialize.
     * @returns A number[] representing the serialized JSON in UTF-8 bytes.
     */
    export function serializeObjectToNumberArray(obj: any): number[] {
    const normalized = normalizeForSerialization(obj);
    const json = JSON.stringify(normalized);
    const u8 = new TextEncoder().encode(json);
    return Array.from(u8);
    }