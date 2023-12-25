const path = require('path');
const fs = require('fs').promises;
let isScanning = false;

/** @type {() => Promise<{name: string, date: number}[]} */
const listFiles = async () => {
  const assetPath = path.join(__dirname, './assets');
  const list = await fs.readdir(assetPath);
  return await Promise.all(list.map(async (f) => {
    const fPath = path.join(__dirname, './assets', f);
    const stats = await fs.stat(fPath);
    return { name: f, date: stats.mtime.getTime() };
  }));
};

/** @type {(filePath: string) => Promise<Buffer>} */
const getFileBuffer = async (filePath) => {
  const assetPath = path.join(__dirname, './assets', filePath);
  return await fs.readFile(assetPath);
};

/** @type {(filePath: string) => Promise<void>} */
const deleteFile = async (filePath) => {
  // do nothing
};

/** @type {() => Promise<void>} */
const startScan = async () => {
  isScanning = true;
  setTimeout(() => {
    isScanning = false;
  }, 5000);
};

/** @type {() => boolean} */
const isScanInProgress = () => isScanning;

module.exports = {
  listFiles,
  getFileBuffer,
  deleteFile,
  startScan,
  isScanInProgress,
};