/**
 * Calculates the hash for a given ArrayBuffer using the specified algorithm.
 * The default algorithm is SHA-256.
 *
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use (e.g., 'SHA-256', 'SHA-1', 'SHA-384', 'SHA-512').
 * @returns A promise that resolves to the hexadecimal string representation of the hash.
 */
export declare function calculateHash(buffer: ArrayBuffer, algorithm?: string): Promise<string>;
/**
 * Calculates the SHA-256 hash for a given ArrayBuffer synchronously.
 *
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use. Currently, only 'SHA-256' is supported.
 * @returns A hexadecimal string representation of the hash.
 */
export declare function calculateHashSync(buffer: ArrayBuffer, algorithm?: string): string;
