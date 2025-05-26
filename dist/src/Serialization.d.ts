/**
 * Serializes any JavaScript object into a Uint8Array using JSON + UTF-8 encoding.
 *
 * @param obj - The object to serialize.
 * @returns A Uint8Array containing the UTF-8 encoded JSON representation of the object.
 */
export declare function objectToUint8Array<T>(obj: T): Uint8Array;
/**
 * Deserializes a Uint8Array back into a JavaScript object using JSON.parse,
 * and restores any numeric-keyed maps into Uint8Arrays.
 *
 * @param data - The Uint8Array containing UTF-8 encoded JSON.
 * @returns The deserialized object of type T with TypedArrays restored.
 */
export declare function uint8ArrayToObject<T>(data: Uint8Array): T;
/**
 * Converts an object to an ArrayBuffer
 *
 * @param obj The object to serialize.
 * @returns The serialized ArrayBuffer.
 */
export declare function objectToArrayBuffer(obj: any): ArrayBuffer;
/**
 * Parses an ArrayBuffer into a JavaScript object by decoding UTF-8 JSON.
 *
 * @param buffer - The ArrayBuffer containing UTF-8 encoded JSON.
 * @returns The parsed object.
 */
export declare function parseBufferToObject(buffer: ArrayBuffer): any;
/**
 * Scans an object for numeric-keyed maps and converts them into Uint8Arrays.
 *
 * @param obj - The object to transform in-place.
 */
export declare function restoreTypedArrays(obj: any): void;
/**
 * Converts an ArrayBuffer back into an object, reconstructing any Uint8Array fields.
 *
 * Combines parseBufferToObject and restoreTypedArrays for full deserialization.
 *
 * @param buffer - The ArrayBuffer to deserialize.
 * @returns The deserialized object with TypedArrays restored.
 */
export declare function arrayBufferToObject<T>(buffer: ArrayBuffer): T;
/**
 * Combines an array of number[] into a single number[].
 *
 * @param arrays - An array of number arrays to combine.
 * @returns A single number[] containing the concatenated data of tutti gli input.
 */
export declare function composeNumberArray(arrays: number[][]): number[];
/**
 * Serializes an object to a number[] using JSON after normalizing it.
 *
 * @param obj The object to serialize.
 * @returns A number[] representing the serialized JSON in UTF-8 bytes.
 */
export declare function serializeObjectToNumberArray(obj: any): number[];
