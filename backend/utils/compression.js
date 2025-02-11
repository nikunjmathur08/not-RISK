const zlib = require('zlib');
const util = require('util');

const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

const compressBuffer = async (buffer) => {
  try {
    const compressed = await gzip(buffer);
    return compressed;
  } catch (error) {
    console.error('Error compressing buffer:', error);
    throw new Error('Failed to compress file');
  }
};

const isGzipped = (buffer) => {
  return buffer[0] === 0x1f && buffer[1] === 0x8b;
};

const decompressBuffer = async (buffer) => {
  try {
    // Check if the buffer is already gzipped
    if (!isGzipped(buffer)) {
      return buffer; // Return as-is if not compressed
    }
    const decompressed = await gunzip(buffer);
    return decompressed;
  } catch (error) {
    console.error('Error decompressing buffer:', error);
    // Return original buffer if decompression fails
    return buffer;
  }
};

module.exports = {
  compressBuffer,
  decompressBuffer
};