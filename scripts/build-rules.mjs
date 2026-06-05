import fs from 'fs';
import path from 'path';

const docsDir = './docs';
const outputFile = './src/data/rules.ts';

const files = fs.readdirSync(docsDir).filter(f => f.endsWith('.txt'));

let output = '// 자동 생성 파일 — scripts/build-rules.mjs 실행 시 갱신됨\n\n';

for (const file of files) {
  const content = fs.readFileSync(path.join(docsDir, file), 'utf-8');
  const varName = file
    .replace('.txt', '')
    .replace(/[^a-zA-Z0-9가-힣]/g, '_');
  output += `export const ${varName} = \`${content.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;\n\n`;
}

const allVars = files.map(f => f.replace('.txt', '').replace(/[^a-zA-Z0-9가-힣]/g, '_'));
output += `export const KNOWLEDGE = [\n${allVars.map(v => `  ${v}`).join(',\n')}\n].join('\\n\\n---\\n\\n');\n`;

fs.mkdirSync('./src/data', { recursive: true });
fs.writeFileSync(outputFile, output, 'utf-8');
console.log(`✅ ${outputFile} 생성 완료 (${files.length}개 파일 포함)`);
