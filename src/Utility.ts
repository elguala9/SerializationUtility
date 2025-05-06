
/**
 * Calculates the hash for a given ArrayBuffer using the specified algorithm.
 * The default algorithm is SHA-256.
 *
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use (e.g., 'SHA-256', 'SHA-1', 'SHA-384', 'SHA-512').
 * @returns A promise that resolves to the hexadecimal string representation of the hash.
 */
export async function calculateHash(buffer: ArrayBuffer, algorithm: string = 'SHA-256'): Promise<string> {
    // Use the SubtleCrypto.digest method to compute the hash
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    // Convert the hash buffer into a hexadecimal string
    return arrayBufferToHex(hashBuffer);
  }
  
  /**
   * Helper function to convert an ArrayBuffer to a hexadecimal string.
   *
   * @param buffer - The ArrayBuffer to convert.
   * @returns A hex string representation of the buffer.
   */
  function arrayBufferToHex(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const hexCodes = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));
    return hexCodes.join('');
  }
  
// Import the sha256 function from js-sha256
import { sha256 } from 'js-sha256';

/**
 * Calculates the SHA-256 hash for a given ArrayBuffer synchronously.
 * 
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use. Currently, only 'SHA-256' is supported.
 * @returns A hexadecimal string representation of the hash.
 */
export function calculateHashSync(buffer: ArrayBuffer, algorithm: string = 'SHA-256'): string {
  // Currently, only SHA-256 is supported in this synchronous implementation.
  if (algorithm !== 'SHA-256') {
    throw new Error('Only SHA-256 is supported in this synchronous implementation.');
  }

  // Convert the ArrayBuffer to a Uint8Array so that js-sha256 can work with it.
  const data = new Uint8Array(buffer);

  // Compute the hash synchronously and return the hexadecimal digest.
  return sha256(data);
}




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