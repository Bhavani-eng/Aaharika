const QRCode = require('qrcode');
const crypto = require('crypto');

const generateQRData = (type, id, extra = {}) => {
  const payload = {
    type,
    id,
    token: crypto.randomBytes(16).toString('hex'),
    timestamp: Date.now(),
    ...extra,
  };
  return JSON.stringify(payload);
};

const generateQRCodeImage = async (data) => {
  try {
    const qrImage = await QRCode.toDataURL(data, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300,
      color: { dark: '#1F2937', light: '#FFF7ED' },
    });
    return qrImage;
  } catch (error) {
    throw new Error(`QR generation failed: ${error.message}`);
  }
};

const verifyQRData = (scannedData, expectedId, expectedType) => {
  try {
    const parsed = typeof scannedData === 'string' ? JSON.parse(scannedData) : scannedData;
    if (parsed.type !== expectedType) {
      return { valid: false, message: 'Invalid QR code type' };
    }
    if (parsed.id !== expectedId) {
      return { valid: false, message: 'QR code does not match this item' };
    }
    const age = Date.now() - parsed.timestamp;
    if (age > 7 * 24 * 60 * 60 * 1000) {
      return { valid: false, message: 'QR code has expired' };
    }
    return { valid: true, data: parsed };
  } catch {
    return { valid: false, message: 'Invalid QR code format' };
  }
};

module.exports = { generateQRData, generateQRCodeImage, verifyQRData };
