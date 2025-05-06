/**
 * Serializza un oggetto in un Uint8Array usando MessagePack.
 *
 * @param obj L'oggetto da serializzare.
 * @returns Uint8Array serializzato.
 */
export declare function serializeObject(obj: any): Uint8Array;
/**
 * Deserializza un Uint8Array in un oggetto usando MessagePack.
 *
 * @param data Il Uint8Array ricevuto.
 * @returns Oggetto deserializzato.
 */
export declare function deserializeObject<T = any>(data: Uint8Array): T;
/**
 * Converte un oggetto in ArrayBuffer usando MessagePack.
 *
 * @param obj - L'oggetto da serializzare.
 * @returns L'ArrayBuffer serializzato.
 */
export declare function objectToArrayBuffer(obj: any): ArrayBuffer;
/**
 * Converte un ArrayBuffer in un oggetto usando MessagePack.
 *
 * @param buffer - L'ArrayBuffer da deserializzare.
 * @returns L'oggetto deserializzato.
 */
export declare function arrayBufferToObject<T>(buffer: ArrayBuffer): T;
