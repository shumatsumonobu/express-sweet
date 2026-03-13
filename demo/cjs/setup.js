const fs = require('node:fs');
const path = require('node:path');
const sqlite3 = require('sqlite3');

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
