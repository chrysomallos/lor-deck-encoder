import fs from 'node:fs/promises';
import DataDragon from './src/data-dragon.mjs';

await fs.mkdir('./cache', {recursive: true});
await new DataDragon().download('./cache');
