/**
 * Helper function to convert an ArrayBuffer to a hexadecimal string.
 *
 * @param buffer - The ArrayBuffer to convert.
 * @returns A hex string representation of the buffer.
 */
export function arrayBufferToHex(buffer) {
    const bytes = new Uint8Array(buffer);
    const hexCodes = Array.from(bytes, byte => byte.toString(16).padStart(2, '0'));
    return hexCodes.join('');
}
//# sourceMappingURL=Utility.js.map