/**
 * Recognizes and preserves TypedArray / DataView instances
 */
function fixObject(obj) {
    // 1) If it's already a binary view (Uint8Array, DataView, etc.)
    if (ArrayBuffer.isView(obj)) {
        return obj;
    }
    // 2) If it's a raw ArrayBuffer, wrap it in a Uint8Array
    if (obj instanceof ArrayBuffer) {
        return new Uint8Array(obj);
    }
    // 3) For arrays, apply recursion
    if (Array.isArray(obj)) {
        return obj.map(fixObject);
    }
    // 4) For plain objects, apply recursion on each property
    if (obj && typeof obj === "object") {
        const out = {};
        for (const key in obj) {
            out[key] = fixObject(obj[key]);
        }
        return out;
    }
    // 5) Otherwise, return primitive values unchanged
    return obj;
}
/**
 * Normalizes an object by converting ArrayBuffers to Uint8Arrays and
 * removing undefined values from objects and arrays
 */
function normalizeForSerialization(obj) {
    // 1) Preserve binary views as-is
    if (ArrayBuffer.isView(obj))
        return obj;
    // 2) Convert raw ArrayBuffer to Uint8Array
    if (obj instanceof ArrayBuffer)
        return new Uint8Array(obj);
    // 3) Process arrays: skip undefined elements and recurse
    if (Array.isArray(obj)) {
        const result = [];
        for (const element of obj) {
            if (element === undefined)
                continue; // drop undefined elements
            result.push(normalizeForSerialization(element));
        }
        return result;
    }
    // 4) Process plain objects: drop undefined properties and recurse
    if (obj !== null && typeof obj === 'object') {
        const result = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value === undefined)
                continue; // drop undefined props
            result[key] = normalizeForSerialization(value);
        }
        return result;
    }
    // 5) Return primitive values (string, number, boolean, null)
    return obj;
}
/**
 * Serializes any JavaScript object into a Uint8Array using JSON + UTF-8 encoding.
 *
 * @param obj - The object to serialize.
 * @returns A Uint8Array containing the UTF-8 encoded JSON representation of the object.
 */
export function objectToUint8Array(obj) {
    const json = JSON.stringify(obj);
    const encoder = new TextEncoder();
    return encoder.encode(json);
}
/**
 * Deserializes a Uint8Array back into a JavaScript object using JSON.parse,
 * and restores any numeric-keyed maps into Uint8Arrays.
 *
 * @param data - The Uint8Array containing UTF-8 encoded JSON.
 * @returns The deserialized object of type T with TypedArrays restored.
 */
export function uint8ArrayToObject(data) {
    // Decode to string
    const json = new TextDecoder().decode(data);
    // Parse JSON
    const parsed = JSON.parse(json);
    // Restore any embedded Uint8Arrays
    restoreTypedArrays(parsed);
    return parsed;
}
/**
 * Converts an object to an ArrayBuffer
 *
 * @param obj The object to serialize.
 * @returns The serialized ArrayBuffer.
 */
export function objectToArrayBuffer(obj) {
    const fixedObj = fixObject(obj);
    const uint8Array = objectToUint8Array(fixedObj); // view on the internal ArrayBuffer
    const { byteOffset, byteLength, buffer } = uint8Array;
    // Return a sliced ArrayBuffer for the exact region
    return buffer.slice(byteOffset, byteOffset + byteLength);
}
/**
 * Parses an ArrayBuffer into a JavaScript object by decoding UTF-8 JSON.
 *
 * @param buffer - The ArrayBuffer containing UTF-8 encoded JSON.
 * @returns The parsed object.
 */
export function parseBufferToObject(buffer) {
    const text = new TextDecoder().decode(buffer);
    return JSON.parse(text);
}
/**
 * Converts a numeric-keyed object (e.g. {"0":num0, "1":num1, ...}) into a Uint8Array.
 *
 * @param numericMap - The object whose keys are numeric strings and values are numbers.
 * @returns A Uint8Array containing the values in index order.
 */
export function numericMapToUint8Array(numericMap) {
    const keys = Object.keys(numericMap)
        .filter(k => /^[0-9]+$/.test(k))
        .map(k => parseInt(k, 10));
    if (keys.length === 0) {
        return new Uint8Array();
    }
    const length = Math.max(...keys) + 1;
    const arr = new Uint8Array(length);
    for (const index of keys) {
        arr[index] = numericMap[String(index)];
    }
    return arr;
}
/**
 * Scans an object for numeric-keyed maps and converts them into Uint8Arrays.
 *
 * @param obj - The object to transform in-place.
 */
export function restoreTypedArrays(obj) {
    for (const [key, value] of Object.entries(obj)) {
        if (value !== null &&
            typeof value === 'object' &&
            !Array.isArray(value)) {
            const entries = Object.entries(value);
            const isNumericMap = entries.length > 0 && entries.every(([k, v]) => /^[0-9]+$/.test(k) && typeof v === 'number');
            if (isNumericMap) {
                obj[key] = numericMapToUint8Array(value);
            }
        }
    }
}
/**
 * Converts an ArrayBuffer back into an object, reconstructing any Uint8Array fields.
 *
 * Combines parseBufferToObject and restoreTypedArrays for full deserialization.
 *
 * @param buffer - The ArrayBuffer to deserialize.
 * @returns The deserialized object with TypedArrays restored.
 */
export function arrayBufferToObject(buffer) {
    const parsed = parseBufferToObject(buffer);
    restoreTypedArrays(parsed);
    return parsed;
}
/**
 * Combines an array of number[] into a single number[].
 *
 * @param arrays - An array of number arrays to combine.
 * @returns A single number[] containing the concatenated data of tutti gli input.
 */
export function composeNumberArray(arrays) {
    // Calcolo la lunghezza totale
    const totalLength = arrays.reduce((sum, arr) => sum + arr.length, 0);
    // Pre-allocazione
    const combined = new Array(totalLength);
    let offset = 0;
    for (const arr of arrays) {
        for (let i = 0; i < arr.length; i++) {
            combined[offset + i] = arr[i];
        }
        offset += arr.length;
    }
    return combined;
}
/**
 * Serializes an object to a number[] using JSON after normalizing it.
 *
 * @param obj The object to serialize.
 * @returns A number[] representing the serialized JSON in UTF-8 bytes.
 */
export function serializeObjectToNumberArray(obj) {
    const normalized = normalizeForSerialization(obj);
    const json = JSON.stringify(normalized);
    const u8 = new TextEncoder().encode(json);
    return Array.from(u8);
}
//# sourceMappingURL=Serialization.js.map