// Import the sha256 function from js-sha256
import { sha256 } from 'js-sha256';
import { arrayBufferToHex } from './Utility.js';
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



