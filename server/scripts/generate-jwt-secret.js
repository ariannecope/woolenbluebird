// Generates a cryptographically secure random secret for ADMIN_JWT_SECRET.
// Run from server/:
//
//   node scripts/generate-jwt-secret.js
//
// Generate a fresh one per environment (dev, staging, prod) — never reuse
// the same secret across environments, and never commit the output.
import { randomBytes } from 'node:crypto'

console.log('ADMIN_JWT_SECRET=' + randomBytes(48).toString('hex'))
