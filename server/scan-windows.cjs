const path = require('path');
const fs = require('fs').promises;
const fsSync = require('fs');
const { exec } = require('child_process');
let isScanning = false;

let OUTPUT_DIR = '.';
const init = () => {
  OUTPUT_DIR = path.join(__dirname, 'output');
  console.log('Output dir is', OUTPUT_DIR);
  if (!fsSync.existsSync(OUTPUT_DIR)) {
    fsSync.mkdirSync(OUTPUT_DIR);
  }
};

const POWERSCRIPT_TEMPLATE = `
# Run with "powershell -File C:\\absolute\\path\\script.ps1"

# Create object to access the scanner
$deviceManager = new-object -ComObject WIA.DeviceManager
$device = $deviceManager.DeviceInfos.Item(1).Connect()

# Create object to access the scanned image later
$imageProcess = new-object -ComObject WIA.ImageProcess

# Store file format GUID strings
$wiaFormatBMP  = "{B96B3CAB-0728-11D3-9D7B-0000F81EF32E}"
$wiaFormatPNG  = "{B96B3CAF-0728-11D3-9D7B-0000F81EF32E}"
$wiaFormatGIF  = "{B96B3CB0-0728-11D3-9D7B-0000F81EF32E}"
$wiaFormatJPEG = "{B96B3CAE-0728-11D3-9D7B-0000F81EF32E}"
$wiaFormatTIFF = "{B96B3CB1-0728-11D3-9D7B-0000F81EF32E}"

# Scan the image from scanner as BMP
foreach ($item in $device.Items) {
    $image = $item.Transfer() 
}

# set type to JPEG and quality/compression level
$imageProcess.Filters.Add($imageProcess.FilterInfos.Item("Convert").FilterID)
$imageProcess.Filters.Item(1).Properties.Item("FormatID").Value = $wiaFormatJPEG
$imageProcess.Filters.Item(1).Properties.Item("Quality").Value = 90
$image = $imageProcess.Apply($image)

# Build filepath from desktop path and filename 'Scan 0'
$filename = "REPLACE_BY_OUTPUT_DIR\\{0}.jpg"

# If a file named 'Scan 0' already exists, increment the index as long as needed
$index = (Get-Date -UFormat %s)
echo $index

$filename = $filename -f $index
$image.SaveFile($filename)

Stop-Process -Id $PID
`;

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
  const scriptTmpPath = path.join(__dirname, '_script.ps1');

  if (!fsSync.existsSync(OUTPUT_DIR)) {
    fsSync.mkdirSync(OUTPUT_DIR);
  }

  const scriptContent = POWERSCRIPT_TEMPLATE
    .replace('REPLACE_BY_OUTPUT_DIR', OUTPUT_DIR);
  fs.writeFileSync(scriptTmpPath, scriptContent);

  return new Promise((resolve, reject) => {
    const childProcess = exec(`powershell -File "${scriptTmpPath}"`);
    childProcess.on('exit', () => {
      isScanning = false;
      resolve(); // Scan complete
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