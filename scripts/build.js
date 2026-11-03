// scripts/build.js - Cross-platform zero-fail Vercel build script
const { execSync } = require('child_process');

// 1. Fallback environment variables for build-time Prisma Client generation
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'file:./dev.db';
}
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'temporary-build-jwt-secret-key-12345';
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

