// Lee el Excel de keywords sin dependencias (xlsx = zip de XML). Uso: node tools/xlsx2json.mjs <archivo.xlsx>
import fs from 'node:fs';
import zlib from 'node:zlib';

const buf = fs.readFileSync(process.argv[2]);
// Parser mínimo de ZIP (central directory)
const eocd = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06]));
const count = buf.readUInt16LE(eocd + 10);
let off = buf.readUInt32LE(eocd + 16);
const files = {};
for (let i = 0; i < count; i++) {
  const comp = buf.readUInt16LE(off + 10), csize = buf.readUInt32LE(off + 20);
  const nlen = buf.readUInt16LE(off + 28), elen = buf.readUInt16LE(off + 30), clen = buf.readUInt16LE(off + 32);
  const lho = buf.readUInt32LE(off + 42);
  const name = buf.toString('utf8', off + 46, off + 46 + nlen);
  const ln = buf.readUInt16LE(lho + 26), le = buf.readUInt16LE(lho + 28);
  const data = buf.subarray(lho + 30 + ln + le, lho + 30 + ln + le + csize);
  files[name] = comp === 8 ? zlib.inflateRawSync(data) : data;
  off += 46 + nlen + elen + clen;
}
const dec = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const ss = files['xl/sharedStrings.xml'] ? [...files['xl/sharedStrings.xml'].toString('utf8').matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => dec([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join(''))) : [];
const wb = files['xl/workbook.xml'].toString('utf8');
const names = [...wb.matchAll(/<sheet [^>]*name="([^"]+)"/g)].map((m) => dec(m[1]));
const out = {};
names.forEach((n, i) => {
  const xml = files[`xl/worksheets/sheet${i + 1}.xml`].toString('utf8');
  const rows = [];
  for (const r of xml.matchAll(/<row [^>]*>([\s\S]*?)<\/row>/g)) {
    const row = [];
    for (const c of r[1].matchAll(/<c r="([A-Z]+)\d+"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const col = c[1].split('').reduce((a, ch) => a * 26 + ch.charCodeAt(0) - 64, 0) - 1;
      const t = /t="(\w+)"/.exec(c[2])?.[1];
      const v = /<v>([\s\S]*?)<\/v>/.exec(c[3] || '')?.[1];
      const is = /<t[^>]*>([\s\S]*?)<\/t>/.exec(c[3] || '')?.[1];
      row[col] = t === 's' ? ss[+v] : t === 'inlineStr' ? dec(is || '') : v !== undefined ? dec(v) : '';
    }
    rows.push(row.map((x) => x ?? ''));
  }
  out[n] = rows;
});
fs.writeFileSync(process.argv[3] || 'tools/excel.json', JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, v]) => `${k}: ${v.length} filas`).join(' | '));
