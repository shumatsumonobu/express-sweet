import fs from 'node:fs';
import path from 'node:path';
import sqlite3 from 'sqlite3';

const dbPath = path.join(process.cwd(), 'demo.sqlite');
const ddl = fs.readFileSync(path.join(process.cwd(), 'ddl.sql'), 'utf8');

const db = new sqlite3.Database(dbPath);
db.exec(ddl, (err) => {
  if (err) {
    console.error('Setup failed:', err.message);
    process.exit(1);
  }
  console.log(`Database created: ${dbPath}`);
  db.close();
});
