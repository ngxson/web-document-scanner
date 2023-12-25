const { DEBUG } = require('./utils.cjs');
const scanTest = require('./scan-test.cjs');
const scanWindows = require('./scan-windows.cjs');
const scanMacOS = require('./scan-macos.cjs');

let impl;

if (DEBUG) {
  impl = scanTest;
} else if (process.platform === 'win32') {
  impl = scanWindows;
  scanWindows.init();
} else if (process.platform === 'darwin') {
  impl = scanMacOS;
  scanMacOS.init();
} else {
  console.error(`Unsupported platform: ${process.platform}`);
  process.exit(1);
}

/** @type {() => Promise<{name: string, date: number}[]} */
const listFiles = impl.listFiles;

/** @type {(filePath: string) => Promise<Buffer>} */
const getFileBuffer = impl.getFileBuffer;

/** @type {(filePath: string) => Promise<void>} */
const deleteFile = impl.deleteFile;

/** @type {() => Promise<void>} */
const startScan = impl.startScan;

/** @type {() => boolean} */
const isScanInProgress = impl.isScanInProgress;

module.exports = {
  listFiles,
  getFileBuffer,
  deleteFile,
  startScan,
  isScanInProgress,
};