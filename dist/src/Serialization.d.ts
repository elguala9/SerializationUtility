/**
 * Serializes an object to a Uint8Array using JSON after normalizing it.
 *
 * @param obj The object to serialize.
 * @returns A Uint8Array representing the serialized JSON.
 */
export declare function serializeObject(obj: any): Uint8Array;
/**
 * Deserializes a Uint8Array back into an object using JSON.parse.
 *
 * @param data The Uint8Array to deserialize.
 * @returns The deserialized object.
 */
export declare function deserializeObject<T = any>(data: Uint8Array): T;
/**
 * Converts an object to an ArrayBuffer
 *
 * @param obj The object to serialize.
 * @returns The serialized ArrayBuffer.
 */
export declare function objectToArrayBuffer(obj: any): ArrayBuffer;
/**
 * Converts an ArrayBuffer back into an object, reconstructing any Uint8Array fields
 *
 * @param buffer The ArrayBuffer to deserialize.
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
