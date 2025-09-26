// Import the hash functions from their respective libraries
import { sha256 } from 'js-sha256';
import { sha1 } from 'js-sha1';
import { md5 } from 'js-md5';
import { arrayBufferToHex } from './Utility.js';

/**
 * Enum for supported hash algorithms
 */
export enum HashAlgorithm {
  SHA256 = 'SHA-256',
  SHA1 = 'SHA-1',
  SHA384 = 'SHA-384',
  SHA512 = 'SHA-512',
  MD5 = 'MD5'
}
/**
 * Calculates the hash for a given ArrayBuffer using the specified algorithm.
 * The default algorithm is SHA-256.
 *
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use.
 * @returns A promise that resolves to the hexadecimal string representation of the hash.
 */
export async function calculateHash(buffer: ArrayBuffer, algorithm: HashAlgorithm = HashAlgorithm.SHA256): Promise<string> {
    // Check if the algorithm is supported by SubtleCrypto
    const supportedAlgorithms = [HashAlgorithm.SHA256, HashAlgorithm.SHA1, HashAlgorithm.SHA384, HashAlgorithm.SHA512];
    if (!supportedAlgorithms.includes(algorithm)) {
        throw new Error(`Algorithm '${algorithm}' is not supported by SubtleCrypto. Supported algorithms: ${supportedAlgorithms.join(', ')}`);
    }
    
    // Use the SubtleCrypto.digest method to compute the hash
    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
    // Convert the hash buffer into a hexadecimal string
    return arrayBufferToHex(hashBuffer);
  }
  



/**
 * Calculates the hash for a given ArrayBuffer synchronously.
 * 
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use.
 * @returns A hexadecimal string representation of the hash.
 */
export function calculateHashSync(buffer: ArrayBuffer, algorithm: HashAlgorithm = HashAlgorithm.SHA256): string {
  // Convert the ArrayBuffer to a Uint8Array so that the hash libraries can work with it.
  const data = new Uint8Array(buffer);

  // Compute the hash synchronously based on the specified algorithm.
  switch (algorithm) {
    case HashAlgorithm.SHA256:
      return sha256(data);
    case HashAlgorithm.SHA1:
      return sha1(data);
    case HashAlgorithm.MD5:
      return md5(data);
    case HashAlgorithm.SHA384:
    case HashAlgorithm.SHA512:
      throw new Error(`Algorithm '${algorithm}' is only supported in the async version (calculateHash)`);
    default:
      throw new Error(`Algorithm '${algorithm}' is not supported. Supported algorithms: ${Object.values(HashAlgorithm).join(', ')}`);
  }
}



