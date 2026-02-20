import { Client, Databases, Storage } from 'node-appwrite';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const envPath = resolve(dirname(fileURLToPath(import.meta.url)), '.env');
const envContent = readFileSync(envPath, 'utf-8');

const env = {};
for (const line of envContent.split(/\r?\n/)) {
    const clean = line.replace(/^\uFEFF/, '').trim();
    if (!clean || clean.startsWith('#')) continue;
    const i = clean.indexOf('=');
    if (i === -1) continue;
    env[clean.slice(0, i).trim()] = clean.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
}

const client = new Client()
    .setEndpoint(env.APPWRITE_ENDPOINT)
    .setProject(env.APPWRITE_PROJECT_ID)
    .setKey(env.APPWRITE_API_KEY);

const databases = new Databases(client);
const storage = new Storage(client);

export { client, databases, storage };
