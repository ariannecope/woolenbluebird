// Generates a bcrypt hash for ADMIN_PASSWORD_HASH without ever writing the
// plaintext password to a file. Run from server/:
//
//   node scripts/hash-password.js
//
// and paste the result into server/.env. The plaintext password only ever
// exists in your terminal's memory for this one command.
import bcrypt from 'bcryptjs'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const rl = createInterface({ input: stdin, output: stdout })

const password = await rl.question('Admin password to hash: ')
rl.close()

if (!password) {
  console.error('No password entered.')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
console.log('\nADMIN_PASSWORD_HASH=' + hash)
