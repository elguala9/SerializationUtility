/**
 * Enum for supported hash algorithms
 */
export declare enum HashAlgorithm {
    SHA256 = "SHA-256",
    SHA1 = "SHA-1",
    SHA384 = "SHA-384",
    SHA512 = "SHA-512",
    MD5 = "MD5"
}
/**
 * Calculates the hash for a given ArrayBuffer using the specified algorithm.
 * The default algorithm is SHA-256.
 *
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use.
 * @returns A promise that resolves to the hexadecimal string representation of the hash.
 */
export declare function calculateHash(buffer: ArrayBuffer, algorithm?: HashAlgorithm): Promise<string>;
/**
 * Calculates the hash for a given ArrayBuffer synchronously.
 *
 * @param buffer - The ArrayBuffer to hash.
 * @param algorithm - The hash algorithm to use.
 * @returns A hexadecimal string representation of the hash.
 */
export declare function calculateHashSync(buffer: ArrayBuffer, algorithm?: HashAlgorithm): string;
