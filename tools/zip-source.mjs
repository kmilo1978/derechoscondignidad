// Empaqueta el código fuente limpio en Pagina web.zip, excluyendo node_modules, .git, dist y archivos .zip
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('Pagina web.zip');
if (fs.existsSync(out)) fs.rmSync(out);

try {
  // En Windows 10/11 y Linux, tar soporta empaquetado zip directamente
  execFileSync('tar', [
    '-a',
    '-c',
    '-f',
    'Pagina web.zip',
    '--exclude=node_modules',
    '--exclude=.git',
    '--exclude=dist',
    '--exclude=*.zip',
    '*'
  ], { stdio: 'inherit' });
  console.log('Listo: Pagina web.zip generado con éxito (' + Math.round(fs.statSync(out).size / 1024) + ' KB)');
} catch (e) {
  console.error('Error al empaquetar con tar:', e.message);
  process.exit(1);
}
