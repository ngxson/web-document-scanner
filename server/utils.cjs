const crypto = require('crypto');
const { Image } = require('imagescript');

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
    console.error(err);
    return false;
  }
}

const MAX_THUMBNAIL_DIM = 500;
/** @type {(inputImage: Buffer) => Promise<Buffer>} */
async function generateThumbnail(inputImage) {
  // TODO: cache the image
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
  return Buffer.from(output);
}

module.exports = {
  DEBUG: process.env.NODE_ENV === 'development',
  generateToken,
  checkToken,
  generateThumbnail,
};