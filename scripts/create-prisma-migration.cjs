#!/usr/bin/env node
const { spawnSync } = require('child_process');

const name = process.argv[2];

if (!name) {
  console.error('Usage: npm run prisma:create-migration -- <migration-name>');
  process.exit(1);
}

const result = spawnSync('npx', ['prisma', 'migrate', 'dev', '--name', name], {
  stdio: 'inherit',
  shell: false,
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
