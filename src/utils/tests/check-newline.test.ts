import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect } from 'chai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const checkFilesInDir = (dir: string, fileExt = '.ts') => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      checkFilesInDir(fullPath, fileExt);
    } else if (entry.isFile() && fullPath.endsWith(fileExt)) {
      it(`Файл заканчивается переводом строки: ${fullPath}`, () => {
        const content = fs.readFileSync(fullPath, 'utf-8');
        expect(content.endsWith('\n')).to.equal(
          true,
          `Файл "${fullPath}" должен заканчиваться переводом строки`
        );
      });
    }
  }
};

describe('Проверка перевода строки в конце файлов', () => {
  checkFilesInDir(path.resolve(__dirname, '../../')); 
});
