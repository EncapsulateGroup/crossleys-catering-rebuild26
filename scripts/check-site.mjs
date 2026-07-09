import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('public');
const errors = [];

async function exists(filePath){
  try{
    await stat(filePath);
    return true;
  }catch{
    return false;
  }
}

async function walk(dir){
  const entries = await readdir(dir, { withFileTypes:true });
  const files = [];
  for(const entry of entries){
    const fullPath = path.join(dir, entry.name);
    if(entry.isDirectory()){
      files.push(...await walk(fullPath));
    }else{
      files.push(fullPath);
    }
  }
  return files;
}

function isExternal(value){
  return /^(https?:|mailto:|tel:|sms:|#|javascript:)/i.test(value);
}

function stripUrl(value){
  return value.split('#')[0].split('?')[0];
}

async function checkLocalRef(sourceFile, rawRef){
  if(rawRef.includes('${')) return;
  const ref = stripUrl(rawRef);
  if(!ref || isExternal(rawRef) || ref.startsWith('/api/')) return;
  const baseDir = path.dirname(sourceFile);
  let target;
  if(ref.startsWith('/')){
    target = path.join(root, ref);
  }else{
    target = path.resolve(baseDir, ref);
  }
  if(ref.endsWith('/')){
    target = path.join(target, 'index.html');
  }
  if(!await exists(target)){
    errors.push(`${path.relative(root, sourceFile)} references missing file: ${rawRef}`);
  }
}

function refsFrom(content){
  const refs = [];
  for(const regex of [
    /\b(?:href|src|data-cookie-src)=["']([^"']+)["']/gi,
    /url\(["']?([^"')]+)["']?\)/gi
  ]){
    let match;
    while((match = regex.exec(content))){
      refs.push(match[1]);
    }
  }
  return refs;
}

async function checkRedirects(){
  const redirectsPath = path.join(root, '_redirects');
  if(!await exists(redirectsPath)) return;
  const lines = (await readFile(redirectsPath, 'utf8')).split(/\r?\n/);
  for(const [index, line] of lines.entries()){
    const raw = line.trim();
    if(!raw || raw.startsWith('#')) continue;
    const parts = raw.split(/\s+/);
    if(parts.length !== 3){
      errors.push(`_redirects line ${index + 1}: expected source destination status`);
      continue;
    }
    const [, destination, statusCode] = parts;
    if(statusCode.startsWith('3') && destination.startsWith('/')){
      const target = destination === '/'
        ? path.join(root, 'index.html')
        : path.join(root, destination.replace(/^\/|\/$/g, ''), 'index.html');
      if(!await exists(target)){
        errors.push(`_redirects line ${index + 1}: destination missing: ${destination}`);
      }
    }
  }
}

async function checkHeaders(){
  const headersPath = path.join(root, '_headers');
  if(!await exists(headersPath)){
    errors.push('missing _headers');
    return;
  }
  const lines = (await readFile(headersPath, 'utf8')).split(/\r?\n/);
  let current = null;
  lines.forEach((line, index) => {
    if(!line.trim() || line.trimStart().startsWith('#')) return;
    if(!line.startsWith(' ') && !line.startsWith('\t')){
      current = line.trim();
      if(!current.startsWith('/') && !current.startsWith('http')){
        errors.push(`_headers line ${index + 1}: path must start with / or http`);
      }
      return;
    }
    if(!current || !line.trim().includes(':')){
      errors.push(`_headers line ${index + 1}: bad header line`);
    }
  });
}

const files = await walk(root);
for(const file of files){
  if(!/\.(html|css|js)$/i.test(file)) continue;
  const content = await readFile(file, 'utf8');
  for(const ref of refsFrom(content)){
    await checkLocalRef(file, ref);
  }
}

for(const required of ['index.html', '404.html', 'robots.txt', 'sitemap.xml', '_headers', '_redirects', 'favicon.png']){
  if(!await exists(path.join(root, required))){
    errors.push(`missing ${required}`);
  }
}

if(!await exists('functions/api/enquiry.js')) errors.push('missing functions/api/enquiry.js');
if(!await exists('functions/api/form-config.js')) errors.push('missing functions/api/form-config.js');

await checkRedirects();
await checkHeaders();

if(errors.length){
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('site check: ok');
