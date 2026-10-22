const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const sharp = require('sharp');

/**
 * Genera un código QR directo y lo guarda en el formato deseado.
 * 
 * @param {string} input - Texto o URL a codificar.
 * @param {object} [options={}] - Opciones de configuración.
 * @param {string} [options.outputPath] - Ruta de salida del archivo (.png, .webp, .svg, .jpg).
 * @param {string} [options.color='#000000'] - Color frontal en hexadecimal.
 * @param {string} [options.bg='#ffffff'] - Color de fondo en hexadecimal.
 * @param {number} [options.size=600] - Resolución en píxeles.
 * @param {'L'|'M'|'Q'|'H'} [options.level='M'] - Nivel de corrección de errores.
 * @param {number} [options.margin=2] - Módulos de margen exterior.
 * @returns {Promise<{ filePath?: string, terminalQR: string }>}
 */
async function generateQR(input, options = {}) {
  if (!input) {
    throw new Error('Se requiere un texto o URL para generar el código QR.');
  }

  const {
    outputPath = null,
    color = '#000000',
    bg = '#ffffff',
    size = 600,
    level = 'M',
    margin = 2,
  } = options;

  const colorConfig = {
    dark: color,
    light: bg,
  };

  // 1. Generar representación en texto para terminal
  let terminalQR = '';
  try {
    terminalQR = await QRCode.toString(input, {
      type: 'terminal',
      small: true,
      errorCorrectionLevel: level,
    });
  } catch (err) {
    // Si la terminal no soporta el formato, continúa sin fallar
  }

  // 2. Si no se solicita archivo de salida, retornar solo la vista de terminal
  if (!outputPath) {
    return { terminalQR };
  }

  const resolvedPath = path.resolve(process.cwd(), outputPath);
  const ext = path.extname(resolvedPath).toLowerCase();

  // Asegurar que el directorio de salida existe
  const parentDir = path.dirname(resolvedPath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }

  // 3. Exportar según la extensión
  if (ext === '.svg') {
    const svgContent = await QRCode.toString(input, {
      type: 'svg',
      margin,
      color: colorConfig,
      errorCorrectionLevel: level,
    });
    fs.writeFileSync(resolvedPath, svgContent, 'utf8');
  } else if (ext === '.webp') {
    const pngBuffer = await QRCode.toBuffer(input, {
      type: 'png',
      width: size,
      margin,
      color: colorConfig,
      errorCorrectionLevel: level,
    });
    await sharp(pngBuffer).webp({ quality: 95 }).toFile(resolvedPath);
  } else if (ext === '.jpg' || ext === '.jpeg') {
    const pngBuffer = await QRCode.toBuffer(input, {
      type: 'png',
      width: size,
      margin,
      color: colorConfig,
      errorCorrectionLevel: level,
    });
    await sharp(pngBuffer).jpeg({ quality: 95 }).toFile(resolvedPath);
  } else {
    // Por defecto exporta a PNG
    await QRCode.toFile(resolvedPath, input, {
      type: 'png',
      width: size,
      margin,
      color: colorConfig,
      errorCorrectionLevel: level,
    });
  }

  return {
    filePath: resolvedPath,
    terminalQR,
  };
}

module.exports = {
  generateQR,
};
