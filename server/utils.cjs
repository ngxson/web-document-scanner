const crypto = require('crypto');
//const { Image } = require('imagescript');

/** @type {(password: string) => string} */
function generateToken(password) {
  const time = Date.now().toString();
  const hmac = crypto.createHmac('sha256', password);
  const hash = hmac.update(time).digest('hex');
  return [time, hash].join('.');
}

/** @type {(token: string, password: string) => boolean} */
function checkToken(token, password) {
  try {
    const [time, hash] = token.split('.');
    const hmac = crypto.createHmac('sha256', password);
    const expectedHash = hmac.update(time).digest('hex');
    return hash === expectedHash;
  } catch (err) {
    // console.error(err);
    return false;
  }
}

const MAX_THUMBNAIL_DIM = 500;
const THUMBNAIL_CACHE = {};
/** @type {(fileName: string, inputImage: Buffer) => Promise<Buffer>} */
async function generateThumbnail(fileName, inputImage) {
  // TODO: imagescript does not work if we bundle everything into single .js file
  /*if (THUMBNAIL_CACHE[fileName]) {
    return THUMBNAIL_CACHE[fileName];
  }
  const image = await Image.decode(inputImage);
  let newH = MAX_THUMBNAIL_DIM;
  let newW = MAX_THUMBNAIL_DIM;
  if (image.height > image.width) {
    newW = parseInt((newH / image.height) * image.width);
  } else {
    newH = parseInt((newW / image.width) * image.height);
  }
  image.resize(newW, newH);
  const output = await image.encodeJPEG(75);
  THUMBNAIL_CACHE[fileName] = Buffer.from(output);
  return THUMBNAIL_CACHE[fileName];*/
  return inputImage;
}

/** @type {(fileName: string) => boolean} */
const isImageFileName = (fileName) => {
  return !!fileName.match(/\.(jpeg|jpg|tif|gif|png|bmp)$/i);
};

module.exports = {
  DEBUG: process.env.NODE_ENV === 'development',
  generateToken,
  checkToken,
  generateThumbnail,
  isImageFileName,
};