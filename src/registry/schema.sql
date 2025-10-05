-- Investigation Registry Schema
-- SQLite database schema for tracking investigation history

CREATE TABLE IF NOT EXISTS investigations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  codebase TEXT NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  duration INTEGER,
  status TEXT NOT NULL CHECK(status IN ('completed', 'failed', 'partial', 'running')),
  agents TEXT NOT NULL, -- JSON array
  tokens_used INTEGER NOT NULL DEFAULT 0,
  quality_score REAL,
  tags TEXT, -- JSON array
  metadata TEXT, -- JSON object
  findings INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_investigations_type ON investigations(type);
CREATE INDEX IF NOT EXISTS idx_investigations_codebase ON investigations(codebase);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigations_start_time ON investigations(start_time);
CREATE INDEX IF NOT EXISTS idx_investigations_quality_score ON investigations(quality_score);
CREATE INDEX IF NOT EXISTS idx_investigations_created_at ON investigations(created_at);

-- Full-text search
CREATE VIRTUAL TABLE IF NOT EXISTS investigations_fts USING fts5(
  id,
  name,
  type,
  codebase,
  tags,
  content='investigations',
  content_rowid='rowid'
);

-- Triggers to keep FTS index synchronized
CREATE TRIGGER IF NOT EXISTS investigations_fts_insert AFTER INSERT ON investigations BEGIN
  INSERT INTO investigations_fts(rowid, id, name, type, codebase, tags)
  VALUES (new.rowid, new.id, new.name, new.type, new.codebase, new.tags);
END;

CREATE TRIGGER IF NOT EXISTS investigations_fts_update AFTER UPDATE ON investigations BEGIN
  UPDATE investigations_fts
  SET id = new.id,
      name = new.name,
      type = new.type,
      codebase = new.codebase,
      tags = new.tags
  WHERE rowid = new.rowid;
END;

CREATE TRIGGER IF NOT EXISTS investigations_fts_delete AFTER DELETE ON investigations BEGIN
  DELETE FROM investigations_fts WHERE rowid = old.rowid;
END;

-- Investigation tags table (for efficient tag queries)
CREATE TABLE IF NOT EXISTS investigation_tags (
  investigation_id TEXT NOT NULL,
  tag TEXT NOT NULL,
  PRIMARY KEY (investigation_id, tag),
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_investigation_tags_tag ON investigation_tags(tag);

-- Investigation agents table (for efficient agent queries)
CREATE TABLE IF NOT EXISTS investigation_agents (
  investigation_id TEXT NOT NULL,
  agent TEXT NOT NULL,
  PRIMARY KEY (investigation_id, agent),
  FOREIGN KEY (investigation_id) REFERENCES investigations(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_investigation_agents_agent ON investigation_agents(agent);
