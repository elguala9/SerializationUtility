
 /**
 * Combines an array of ArrayBuffers into a single ArrayBuffer.
 *
 * @param buffers - An array of ArrayBuffers to combine.
 * @returns A single ArrayBuffer containing the concatenated data of all provided ArrayBuffers.
 */
export function composeUint8Array(buffers: Uint8Array[]): Uint8Array {
  // Calculate the total length of the final ArrayBuffer
  const totalLength = buffers.reduce((acc, buffer) => acc + buffer.byteLength, 0);

  // Create a new Uint8Array with the total length
  const combined = new Uint8Array(totalLength);

  // Copy each ArrayBuffer into the combined Uint8Array
  let offset = 0;
  for (const buffer of buffers) {
    combined.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  // Return the underlying ArrayBuffer
  return combined;
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
