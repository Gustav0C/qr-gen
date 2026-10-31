# 📱 QR-GEN

> Generador CLI de códigos QR matemáticos, estáticos y permanentes para la terminal. Exporta en **PNG**, **WebP**, **SVG** y **consola ANSI**.

Sin APIs intermediarias, sin suscripciones y sin fechas de vencimiento. El código QR codifica directamente el enlace en la matriz estándar ISO/IEC 18004.

---

<img width="823" height="645" alt="Portafolioimage" src="https://github.com/user-attachments/assets/e6120eb2-02c3-4b03-bdcf-def52b88805d" />

## 🚀 Instalación rápida

### Opción 1: Instalar como comando global en tu máquina

Clona el repositorio e instálalo globalmente con npm:

```bash
git clone https://github.com/Gustav0C/qr-gen.git
cd qr-gen
npm install
npm link
```

*¡Listo! Ahora tienes el comando `qr` disponible en cualquier terminal de tu computadora (Windows, Mac o Linux).*

---

### Opción 2: Usar sin instalación global (en la carpeta del proyecto)

```bash
git clone https://github.com/Gustav0C/qr-gen.git
cd qr-gen
npm install

node bin/cli.js https://midominio.com
```

---

## 💻 Ejemplos de uso

### 1. Generación básica (más rápido)
```bash
qr https://qilqa.pe
```
*Genera un archivo `qr-qilqa-pe.png` en la carpeta actual y dibuja el QR en la terminal para escanearlo directo con tu celular.*

### 2. Elegir nombre y formato (`.png`, `.webp`, `.svg`, `.jpg`)
```bash
qr https://qilqa.pe menu.webp
qr https://qilqa.pe logo.svg
qr https://qilqa.pe mesa-1.png
```

### 3. Personalizar colores
```bash
# Color borgoña/vino con fondo blanco
qr https://qilqa.pe qr.png --color "#73002b"

# Color azul oscuro sobre fondo crema suave
qr https://qilqa.pe qr.webp --color "#0f172a" --bg "#f8fafc"
```

### 4. Alta resolución para impresión física
```bash
# 1200px con nivel de corrección H (30% de redundancia contra daños físicos)
qr https://qilqa.pe impresion.png --size 1200 --level H
```

### 5. Solo visualizar en consola (sin crear archivo)
```bash
qr https://qilqa.pe --terminal-only
```

---

## 🛠️ Opciones completas

| Parámetro | Descripción | Valor por defecto |
|---|---|---|
| `--color <hex>` | Color del código QR | `#000000` |
| `--bg <hex>` | Color del fondo | `#ffffff` |
| `--size <px>` | Dimensión en píxeles (ancho y alto) | `600` |
| `--level <L\|M\|Q\|H>` | Nivel de corrección de error (7%, 15%, 25%, 30%) | `M` |
| `--margin <num>` | Margen exterior en módulos | `2` |
| `--terminal-only` | Solo dibuja en consola, no crea archivo | `false` |
| `-h, --help` | Muestra la ayuda | — |

---

## 📦 Uso como módulo en Node.js

También puedes importarlo en otros proyectos:

```javascript
const { generateQR } = require('qr-gen-cli');

async function main() {
  const result = await generateQR('https://qilqa.pe', {
    outputPath: './output.webp',
    color: '#73002b',
    size: 800,
  });

  console.log('Archivo creado en:', result.filePath);
}

main();
```

---

## 📄 Licencia

MIT © [Gustavo Canales](https://github.com/Gustav0C)
