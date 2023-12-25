const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { isImageFileName } = require('./utils.cjs');
let isScanning = false;

let OUTPUT_DIR = '.';
const init = () => {
  OUTPUT_DIR = path.join(process.env.HOME, 'Documents/Archive');
  console.log('Output dir is', OUTPUT_DIR);
  if (!fsSync.existsSync(OUTPUT_DIR)) {
    fsSync.mkdirSync(OUTPUT_DIR);
  }
};

/** @type {() => Promise<{name: string, date: number}[]} */
const listFiles = async () => {
  const assetPath = path.join(OUTPUT_DIR);
  const list = await fs.readdir(assetPath);
  return await Promise.all(list
    .filter(f => isImageFileName(f))
    .map(async (f) => {
      const fPath = path.join(OUTPUT_DIR, f);
      const stats = await fs.stat(fPath);
      return { name: f, date: stats.mtime.getTime() };
    }
  ));
};

/** @type {(filePath: string) => Promise<Buffer>} */
const getFileBuffer = async (filePath) => {
  const fPath = path.join(OUTPUT_DIR, filePath);
  return await fs.readFile(fPath);
};

/** @type {(filePath: string) => Promise<void>} */
const deleteFile = async (filePath) => {
  const fPath = path.join(OUTPUT_DIR, filePath);
  return await fs.unlink(fPath);
};

/** @type {() => Promise<void>} */
const startScan = async () => {
  if (isScanning) {
    return; // ignore if already running
  }
  isScanning = true;
  return new Promise((resolve, reject) => {
    const childProcess = exec('scanline -jpeg -flatbed -verbose');
    childProcess.on('exit', () => {
      isScanning = false;
      resolve();
    });
  });
};

/** @type {() => boolean} */
const isScanInProgress = () => isScanning;

module.exports = {
  init,
  listFiles,
  getFileBuffer,
  deleteFile,
  startScan,
  isScanInProgress,
};