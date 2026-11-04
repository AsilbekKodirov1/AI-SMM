// scripts/build.js - Cross-platform zero-fail Vercel build script
require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// 1. Fallback environment variables for build-time Prisma Client generation
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'temporary-build-jwt-secret-key-12345';
}

// 2. Adjust schema provider dynamically based on DATABASE_URL
const isPostgres = process.env.DATABASE_URL.startsWith('postgres://') || process.env.DATABASE_URL.startsWith('postgresql://');
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
if (fs.existsSync(schemaPath)) {
  let schema = fs.readFileSync(schemaPath, 'utf8');
  if (isPostgres && schema.includes('provider = "sqlite"')) {
    console.log('[AI SMM Build] Detected PostgreSQL database URL. Updating Prisma provider to postgresql...');
    schema = schema.replace('provider = "sqlite"', 'provider = "postgresql"');
    fs.writeFileSync(schemaPath, schema, 'utf8');
  } else if (!isPostgres && schema.includes('provider = "postgresql"')) {
    console.log('[AI SMM Build] Detected SQLite database URL. Updating Prisma provider to sqlite...');
    schema = schema.replace('provider = "postgresql"', 'provider = "sqlite"');
    fs.writeFileSync(schemaPath, schema, 'utf8');
  }
}

console.log('[AI SMM Build] Step 1: Generating Prisma Client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.error('[AI SMM Build] Prisma generate error:', err);
  process.exit(1);
}

console.log('[AI SMM Build] Step 2: Running Next.js Build...');
try {
  execSync('npx next build', { stdio: 'inherit', env: process.env });
} catch (err) {
  console.error('[AI SMM Build] Next.js build error:', err);
  process.exit(1);
}

console.log('[AI SMM Build] Build completed successfully!');

