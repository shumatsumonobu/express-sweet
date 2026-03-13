DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  avatar TEXT DEFAULT 'avatar-1.png',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO users (name, email, password, avatar) VALUES
  ('Kai', 'kai@example.com', 'password123', 'avatar-1.png'),
  ('Rio', 'rio@example.com', 'password123', 'avatar-2.png');
