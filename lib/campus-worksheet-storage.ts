import { CampusError } from "./campus-types";

// The independent Workers Free deployment stores only teacher PDFs in D1.
// Sites continues to use its existing R2 binding, including for authored speech.
export const WORKSHEET_STORAGE_MAX_BYTES = 100 * 1024 * 1024;
export const WORKSHEET_STORAGE_FILE_BYTES = 5 * 1024 * 1024;
export const WORKSHEET_STORAGE_CHUNK_BYTES = 512 * 1024;

export type CampusWorksheetBucket = {
    get(key: string): Promise<{ body: Uint8Array<ArrayBuffer>; size: number } | null>;
    put(key: string, bytes: ArrayBuffer, options?: { httpMetadata?: { contentType?: string } }): Promise<unknown>;
    delete(keys: string | string[]): Promise<void>;
};

type ChunkRow = { byte_length: number; chunk_index: number; payload: number[] };

export function createD1WorksheetBucket(db: D1Database, options: { maxBytes?: number } = {}): CampusWorksheetBucket {
    const maxBytes = options.maxBytes ?? WORKSHEET_STORAGE_MAX_BYTES;
    if (!Number.isSafeInteger(maxBytes) || maxBytes < 1 || maxBytes > WORKSHEET_STORAGE_MAX_BYTES) {
        throw new Error("Worksheet storage limit must be an integer from 1 to 104857600 bytes.");
    }
    return {
        async get(key) {
            // One snapshot prevents a concurrent replacement mixing old and new chunks.
            const rows = await db.prepare(`SELECT o.byte_length,c.chunk_index,c.payload
                FROM campus_worksheet_objects o JOIN campus_worksheet_chunks c ON c.object_key=o.object_key
                WHERE o.object_key=? ORDER BY c.chunk_index`).bind(key).all<ChunkRow>();
            if (!rows.results.length) return null;
            const size = rows.results[0].byte_length, body = new Uint8Array(size);
            let offset = 0;
            for (const [index, row] of rows.results.entries()) {
                if (row.chunk_index !== index || row.byte_length !== size || offset + row.payload.length > size) {
                    throw new Error("Worksheet storage is incomplete.");
                }
                body.set(row.payload, offset);
                offset += row.payload.length;
            }
            if (offset !== size) throw new Error("Worksheet storage is incomplete.");
            return { body, size };
        },
        async put(key, bytes) {
            if (!bytes.byteLength || bytes.byteLength > WORKSHEET_STORAGE_FILE_BYTES) {
                throw new CampusError(413, "WORKSHEET_SIZE", "Each PDF must be 5 MB or smaller.");
            }
            // D1 batch is one transaction. Trigger-backed accounting therefore
            // reserves the quota atomically, even for simultaneous uploads.
            const statements = [
                db.prepare("UPDATE campus_worksheet_storage SET max_bytes=? WHERE id=1").bind(maxBytes),
                db.prepare("DELETE FROM campus_worksheet_objects WHERE object_key=?").bind(key),
                db.prepare("INSERT INTO campus_worksheet_objects(object_key,byte_length) VALUES(?,?)").bind(key, bytes.byteLength),
            ];
            for (let offset = 0; offset < bytes.byteLength; offset += WORKSHEET_STORAGE_CHUNK_BYTES) {
                statements.push(db.prepare("INSERT INTO campus_worksheet_chunks(object_key,chunk_index,payload) VALUES(?,?,?)")
                    .bind(key, offset / WORKSHEET_STORAGE_CHUNK_BYTES, bytes.slice(offset, offset + WORKSHEET_STORAGE_CHUNK_BYTES)));
            }
            try { await db.batch(statements); }
            catch (error) {
                if (String(error).includes("WORKSHEET_STORAGE_QUOTA")) {
                    throw new CampusError(507, "WORKSHEET_STORAGE_QUOTA", "Worksheet storage is full. Delete an unused worksheet before uploading another.");
                }
                throw error;
            }
        },
        async delete(keys) {
            const list = [...new Set(typeof keys === "string" ? [keys] : keys)];
            if (!list.length) return;
            // Cascading chunk deletion and quota release occur in the same transaction.
            await db.batch(list.map(key => db.prepare("DELETE FROM campus_worksheet_objects WHERE object_key=?").bind(key)));
        },
    };
}
