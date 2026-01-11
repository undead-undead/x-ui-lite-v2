ALTER TABLE users ADD COLUMN password_version INTEGER NOT NULL DEFAULT 1;


UPDATE users SET password_version = 1 WHERE password_version IS NULL OR password_version = 0;
