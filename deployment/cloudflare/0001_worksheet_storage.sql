-- Standalone Workers Free deployment only; Sites retains its R2 storage.
-- 100 MiB of PDF payload leaves room for class data and SQLite overhead
-- within the Workers Free per-database 500 MB limit.
CREATE TABLE IF NOT EXISTS campus_worksheet_storage (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    used_bytes INTEGER NOT NULL DEFAULT 0 CHECK (used_bytes >= 0),
    max_bytes INTEGER NOT NULL DEFAULT 104857600 CHECK (max_bytes BETWEEN 1 AND 104857600)
);
--> statement-breakpoint
INSERT OR IGNORE INTO campus_worksheet_storage(id) VALUES(1);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS campus_worksheet_objects (
    object_key TEXT PRIMARY KEY NOT NULL,
    byte_length INTEGER NOT NULL CHECK (byte_length BETWEEN 1 AND 5242880)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS campus_worksheet_chunks (
    object_key TEXT NOT NULL REFERENCES campus_worksheet_objects(object_key) ON DELETE CASCADE,
    chunk_index INTEGER NOT NULL CHECK (chunk_index >= 0),
    payload BLOB NOT NULL CHECK (length(payload) BETWEEN 1 AND 524288),
    PRIMARY KEY (object_key, chunk_index)
);
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS campus_worksheet_quota_before_insert
BEFORE INSERT ON campus_worksheet_objects
WHEN (SELECT used_bytes + NEW.byte_length > max_bytes FROM campus_worksheet_storage WHERE id=1)
BEGIN
    SELECT RAISE(ABORT, 'WORKSHEET_STORAGE_QUOTA');
END;
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS campus_worksheet_quota_after_insert
AFTER INSERT ON campus_worksheet_objects
BEGIN
    UPDATE campus_worksheet_storage SET used_bytes=used_bytes+NEW.byte_length WHERE id=1;
END;
--> statement-breakpoint
CREATE TRIGGER IF NOT EXISTS campus_worksheet_quota_after_delete
AFTER DELETE ON campus_worksheet_objects
BEGIN
    UPDATE campus_worksheet_storage SET used_bytes=used_bytes-OLD.byte_length WHERE id=1;
END;
