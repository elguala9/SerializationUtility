/**
* Combines an array of ArrayBuffers into a single ArrayBuffer.
*
* @param buffers - An array of ArrayBuffers to combine.
* @returns A single ArrayBuffer containing the concatenated data of all provided ArrayBuffers.
*/
export declare function composeUint8Array(buffers: Uint8Array[]): Uint8Array;
/**
 * Serializes any JavaScript object into a Uint8Array using JSON + UTF-8 encoding.
 *
 * @param obj - The object to serialize.
 * @returns A Uint8Array containing the UTF-8 encoded JSON representation of the object.
 */
export declare function objectToUint8Array<T>(obj: T): Uint8Array;
/**
 * Deserializes a Uint8Array back into a JavaScript object using JSON.parse.
 *
 * @param data - The Uint8Array containing UTF-8 encoded JSON.
 * @returns The deserialized object of type T.
 */
export declare function uint8ArrayToObject<T>(data: Uint8Array): T;
