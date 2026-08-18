import fs from 'node:fs';
import path from 'node:path';
import mariadb from 'mariadb';

// Read .env directly: this script runs outside express-sweet, so mount() has
// not loaded it. The password is stored encoded, mirroring what
// hook_after_env_load decodes at application startup.
for (const line of fs.readFileSync(path.join(process.cwd(), '.env'), 'utf8').split('\n')) {
  const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (match)
    process.env[match[1]] = match[2];
}
const password = Buffer.from(process.env.DB_PASSWORD_B64, 'base64').toString();

const ddl = fs.readFileSync(path.join(process.cwd(), 'ddl.sql'), 'utf8');

const connection = await mariadb.createConnection({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password,
  multipleStatements: true,
});

try {
  await connection.query(ddl);
  console.log(`Database ready: ${process.env.DB_NAME}`);
} catch (error) {
  console.error('Setup failed:', error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
