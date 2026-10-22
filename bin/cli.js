#!/usr/bin/env node

const path = require('path');
const { generateQR } = require('../src/generator');

function printHelp() {
  console.log(`
\x1b[1m\x1b[36mQR-GEN\x1b[0m — Generador de códigos QR directos y permanentes

\x1b[1mUso:\x1b[0m
  qr <url-o-texto> [archivo-salida] [opciones]

\x1b[1mEjemplos:\x1b[0m
  qr https://midominio.com
  qr https://midominio.com codigo.png
  qr https://midominio.com codigo.webp
  qr https://midominio.com vector.svg
  qr https://midominio.com --color "#73002b"
  qr https://midominio.com --color "#0f172a" --bg "#f8fafc"
  qr https://midominio.com --size 1200 --level H
  qr https://midominio.com --terminal-only

\x1b[1mOpciones:\x1b[0m
  --color <hex>      Color del QR (por defecto: #000000)
  --bg <hex>         Color del fondo (por defecto: #ffffff)
  --size <px>        Resolución en píxeles para imágenes (por defecto: 600)
  --level <L|M|Q|H>  Nivel de corrección de errores (por defecto: M)
  --margin <num>     Margen exterior en módulos (por defecto: 2)
  --terminal-only    Solo muestra el QR en la terminal sin guardar archivo
  -h, --help         Muestra este mensaje de ayuda
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    printHelp();
    process.exit(0);
  }

  let input = null;
  let outputFile = null;
  let color = '#000000';
  let bg = '#ffffff';
  let size = 600;
  let level = 'M';
  let margin = 2;
  let terminalOnly = false;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--color' && args[i + 1]) {
      color = args[++i];
    } else if (arg === '--bg' && args[i + 1]) {
      bg = args[++i];
    } else if (arg === '--size' && args[i + 1]) {
      size = parseInt(args[++i], 10) || 600;
    } else if (arg === '--level' && args[i + 1]) {
      level = args[++i].toUpperCase();
    } else if (arg === '--margin' && args[i + 1]) {
      margin = parseInt(args[++i], 10) || 2;
    } else if (arg === '--terminal-only') {
      terminalOnly = true;
    } else if (!arg.startsWith('-')) {
      if (!input) {
        input = arg;
      } else if (!outputFile) {
        outputFile = arg;
      }
    }
  }

  if (!input) {
    console.error('\x1b[31mError:\x1b[0m Debes especificar una URL o texto a codificar.');
    process.exit(1);
  }

  if (!outputFile && !terminalOnly) {
    try {
      const parsedUrl = new URL(input);
      const cleanHost = parsedUrl.hostname.replace(/[^a-zA-Z0-9_-]/g, '-');
      outputFile = `qr-${cleanHost}.png`;
    } catch {
      outputFile = 'qr-code.png';
    }
  }

  console.log(`\n\x1b[32m✔\x1b[0m Generando QR para: \x1b[1m${input}\x1b[0m`);

  try {
    const result = await generateQR(input, {
      outputPath: terminalOnly ? null : outputFile,
      color,
      bg,
      size,
      level,
      margin,
    });

    if (result.terminalQR) {
      console.log(result.terminalQR);
    }

    if (result.filePath) {
      console.log(`\x1b[32m✔ Archivo guardado:\x1b[0m \x1b[1m${result.filePath}\x1b[0m\n`);
    }
  } catch (err) {
    console.error('\x1b[31mError:\x1b[0m', err.message);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('\x1b[31mError inesperado:\x1b[0m', err);
  process.exit(1);
});
