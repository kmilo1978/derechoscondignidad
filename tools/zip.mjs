// Empaqueta el CONTENIDO de dist/ (no la carpeta) en sitio-para-subir.zip, incluido .htaccess.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const out = path.resolve('sitio-para-subir.zip');
if (!fs.existsSync('dist/index.html')) { console.error('Primero ejecuta: npm run build'); process.exit(1); }
if (fs.existsSync(out)) fs.rmSync(out);
const items = fs.readdirSync('dist').map((n) => path.resolve('dist', n).replace(/'/g, "''"));
const ps = `Compress-Archive -Path ${items.map((p) => `'${p}'`).join(',')} -DestinationPath '${out.replace(/'/g, "''")}' -CompressionLevel Optimal`;
execFileSync('powershell', ['-NoProfile', '-Command', ps], { stdio: 'inherit' });
console.log('Listo:', out, Math.round(fs.statSync(out).size / 1024), 'KB');
