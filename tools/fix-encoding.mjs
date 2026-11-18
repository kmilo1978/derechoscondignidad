// Revierte doble codificación UTF-8 -> cp1252 -> UTF-8 causada por Get-Content/Set-Content de PowerShell 5.
import fs from 'node:fs';
const file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
if (s.charCodeAt(0) === 0xfeff) s = s.slice(1);
const map = new Map();
const dec = new TextDecoder('windows-1252');
for (let b = 0; b < 256; b++) map.set(dec.decode(new Uint8Array([b])), b);
const bytes = [];
let bad = 0;
for (const ch of s) {
  if (map.has(ch)) bytes.push(map.get(ch));
  else { bad++; bytes.push(...Buffer.from(ch, 'utf8')); }
}
fs.writeFileSync(file, Buffer.from(bytes));
console.log('restaurado', file, 'caracteres no mapeados:', bad);
