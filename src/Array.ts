
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


