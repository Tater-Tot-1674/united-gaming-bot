import fs from 'fs';
import path from 'path';

const siteDataPath = path.join(process.cwd(), '../kartkings-site/data');

export async function syncToSite(fileName, data) {
  try {
    const filePath = path.join(siteDataPath, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Synced ${fileName} to site data.`);
    return true;
  } catch (error) {
    console.error(`Error writing ${fileName} to site:`, error);
    return false;
  }
}

