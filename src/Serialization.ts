import { encode, decode } from "@msgpack/msgpack";


/**
 * Riconosce e conserva TypedArray / DataView
 */
function fixObject(obj: any): any {
  // 1) Se è già una view binaria (Uint8Array, DataView, ecc.)
  if (ArrayBuffer.isView(obj)) {
    return obj;
  }
  // 2) Se è un ArrayBuffer “puro”, wrappalo in Uint8Array
  if (obj instanceof ArrayBuffer) {
    return new Uint8Array(obj);
  }
  // 3) Array → ricorsione
  if (Array.isArray(obj)) {
    return obj.map(fixObject);
  }
  // 4) Oggetto plain → ricorsione
  if (obj && typeof obj === "object") {
    const out: any = {};
    for (const k in obj) {
      out[k] = fixObject(obj[k]);
    }
    return out;
  }
  // 5) Primitivo (string, number, boolean, null…)
  return obj;
}

/**
 * Normalizza un oggetto: trasforma tutti gli ArrayBuffer in Uint8Array
 */
function normalizeForSerialization(obj: any): any {
  if (ArrayBuffer.isView(obj)) return obj;
  if (obj instanceof ArrayBuffer) return new Uint8Array(obj);
  if (Array.isArray(obj)) return obj.map(normalizeForSerialization);

  if (obj && typeof obj === 'object') {
    const res: any = {};
    for (const [k, v] of Object.entries(obj)) {
      if (v === undefined) continue;           // 🔥 salta undefined
      res[k] = normalizeForSerialization(v);
    }
    return res;
  }

  // primitivo (string, number, boolean, null…)
  return obj;
}

/**
 * Serializza un oggetto in un Uint8Array usando MessagePack.
 *
 * @param obj L'oggetto da serializzare.
 * @returns Uint8Array serializzato.
 */
export function serializeObject(obj: any): Uint8Array {
  const normalized = normalizeForSerialization(obj);
  return encode(normalized);
}

/**
 * Deserializza un Uint8Array in un oggetto usando MessagePack.
 *
 * @param data Il Uint8Array ricevuto.
 * @returns Oggetto deserializzato.
 */
export function deserializeObject<T = any>(data: Uint8Array): T {
  return decode(data) as T;
}

/**
 * Converte un oggetto in ArrayBuffer usando MessagePack.
 *
 * @param obj - L'oggetto da serializzare.
 * @returns L'ArrayBuffer serializzato.
 */
export function objectToArrayBuffer(obj: any): ArrayBuffer {
  const fixedObj   = fixObject(obj);
  const uint8Array = encode(fixedObj);        // view su ArrayBuffer interno
  const { byteOffset, byteLength, buffer } = uint8Array;

  // slice dell’ArrayBuffer solo nella porzione [offset, offset+length)
  return buffer.slice(byteOffset, byteOffset + byteLength);
}

/**
 * Converte un ArrayBuffer in un oggetto usando MessagePack.
 *
 * @param buffer - L'ArrayBuffer da deserializzare.
 * @returns L'oggetto deserializzato.
 */
export function arrayBufferToObject<T>(buffer: ArrayBuffer): T {
  const uint8Array = new Uint8Array(buffer); // creo Uint8Array dal buffer
  const obj = decode(uint8Array); // decode restituisce l'oggetto
  console.log("msgpack decoded object", obj);

  return obj as T;
}