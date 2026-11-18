// Empaqueta el CONTENIDO de dist/ (no la carpeta) en sitio-para-subir.zip, incluido .htaccess.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const out = path.resolve('sitio-para-subir.zip');
if (!fs.existsSync('dist/index.html')) {
  console.error('Primero ejecuta: npm run build');
  process.exit(1);
}
if (fs.existsSync(out)) fs.rmSync(out);

try {
  // Usar python zipfile para evitar bloqueos de archivos en uso en Windows
  const pyCode = `
import zipfile, os, sys
out_path = sys.argv[1]
dist_dir = sys.argv[2]
with zipfile.ZipFile(out_path, 'w', zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(dist_dir):
        for f in files:
            p = os.path.join(root, f)
            arc = os.path.relpath(p, dist_dir)
            z.write(p, arc)
`;
  execFileSync('python', ['-c', pyCode, out, path.resolve('dist')], { stdio: 'inherit' });
  console.log('Listo:', out, Math.round(fs.statSync(out).size / 1024), 'KB');
} catch (e) {
  console.error('Error al empaquetar:', e.message);
  process.exit(1);
}
