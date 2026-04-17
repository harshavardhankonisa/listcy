import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')

const pool = new Pool({
  connectionString,
  // TODO: If you must connect to a self-signed cert, provide the CA explicitly:
  // ssl: { rejectUnauthorized: true, ca: fs.readFileSync('ca.pem').toString() }
  ssl:
    process.env.NODE_ENV === 'production'
      ? { rejectUnauthorized: true }
      : false,

  max: Number(process.env.DATABASE_POOL_MAX ?? 20),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  application_name: 'listcy',
})

pool.on('error', (err) => {
  console.error('[DB] Idle pool client error:', err)
})

export const db = drizzle({ client: pool })
