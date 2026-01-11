

ALTER TABLE inbounds ADD COLUMN tag TEXT;

ALTER TABLE inbounds ADD COLUMN listen TEXT;

ALTER TABLE inbounds ADD COLUMN allocate TEXT;

CREATE INDEX IF NOT EXISTS idx_inbounds_tag ON inbounds(tag);

UPDATE inbounds SET tag = 'inbound-' || id WHERE tag IS NULL;
