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
 * Converts an ArrayBuffer back into an object
 *
 * @param buffer The ArrayBuffer to deserialize.
 * @returns The deserialized object.
 */
export declare function arrayBufferToObject<T>(buffer: ArrayBuffer): T;
