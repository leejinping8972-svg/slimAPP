import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(base, 'src');
const assets = path.join(src, 'assets');

const COLOR_MAP = {
  '#5cb85c': '#D8CBB8',
  '#4cae4c': '#C4B5A0',
  '#3d8f3d': '#9A9188',
  '#7bc98a': '#E8DCC8',
  '#30a68e': '#B59461',
  '#0d0d0c': '#4E554B',
  '#f6f6f6': '#F7F5F1',
  '#333333': '#6C6763',
  '#a881e6': '#D8CBB8',
  '#6b42b6': '#4E554B',
};

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules') continue;
      walk(full);
    } else if (/\.(tsx?|css)$/.test(entry.name)) {
      let content = fs.readFileSync(full, 'utf8');
      let changed = false;
      for (const [from, to] of Object.entries(COLOR_MAP)) {
        const upper = from.toUpperCase();
        if (content.includes(from)) {
          content = content.split(from).join(to);
          changed = true;
        }
        if (content.includes(upper)) {
          content = content.split(upper).join(to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(full, content);
        console.log('updated', path.relative(base, full));
      }
    }
  }
}

function copyLogo(srcFile, destFile) {
  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, destFile);
    console.log('copied', path.relative(base, destFile));
  }
}

walk(src);

copyLogo(path.join(assets, 'shilajit', 'luckdate-logo.png'), path.join(assets, 'logo.png'));
copyLogo(path.join(assets, 'shilajit', 'luckdate-logo-white.png'), path.join(assets, 'logo-white.png'));
copyLogo(path.join(assets, 'logo.png'), path.join(base, 'public', 'logo.png'));

console.log('VI brand apply complete');
