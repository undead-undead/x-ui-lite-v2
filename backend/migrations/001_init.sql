CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    password_version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS inbounds (
    id TEXT PRIMARY KEY,
    remark TEXT NOT NULL,
    protocol TEXT NOT NULL,
    port INTEGER NOT NULL,
    enable BOOLEAN DEFAULT 1,
    settings TEXT,
    stream_settings TEXT,
    sniffing TEXT,
    tag TEXT,
    listen TEXT,
    allocate TEXT,
    up BIGINT DEFAULT 0,
    down BIGINT DEFAULT 0,
    total BIGINT DEFAULT 0,
    expiry BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS panel_settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    listen_ip TEXT DEFAULT '',
    port INTEGER DEFAULT 33789,
    web_root TEXT DEFAULT '/',
    ssl_cert_path TEXT DEFAULT '',
    ssl_key_path TEXT DEFAULT '',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_inbounds_enable ON inbounds(enable);
CREATE INDEX IF NOT EXISTS idx_inbounds_protocol ON inbounds(protocol);

INSERT OR IGNORE INTO users (id, username, password_hash) 
VALUES (1, 'admin', 'temporary');

INSERT OR IGNORE INTO panel_settings (id, listen_ip, port, web_root)
VALUES (1, '', 33789, '/');
