import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(base, 'src');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full);
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      const next = content
        .replace(/font-\['Bricolage_Grotesque'\]/g, "font-['Montserrat']")
        .replace(/font-\['Bricolage Grotesque'\]/g, "font-['Montserrat']");
      if (next !== content) {
        fs.writeFileSync(full, next);
        console.log('updated', path.relative(base, full));
      }
    }
  }
}

walk(src);
