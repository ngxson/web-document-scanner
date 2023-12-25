const { DEBUG } = require('./utils.cjs');
const scanTest = require('./scan-test.cjs');

let impl;

if (DEBUG) {
  impl = scanTest;
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