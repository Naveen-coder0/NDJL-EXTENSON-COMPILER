// Generate a proper NDJL icon (.ico) for Inno Setup
// Run: node generate-icon.js
// Produces: assets/ndjl.ico and assets/ndjl-logo.ico

const fs = require('fs');
const path = require('path');

function createICO() {
    const size = 32;
    const bpp = 32; // 32-bit BGRA
    const pixelCount = size * size;
    const imageDataSize = pixelCount * 4; // BGRA
    const maskRowBytes = Math.ceil(size / 8);
    const maskRowPadded = Math.ceil(maskRowBytes / 4) * 4;
    const maskSize = maskRowPadded * size;
    const dibHeaderSize = 40;
    const totalImageSize = dibHeaderSize + imageDataSize + maskSize;

    // ICO file header (6 bytes)
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);     // reserved
    header.writeUInt16LE(1, 2);     // type: ICO
    header.writeUInt16LE(1, 4);     // 1 image

    // Directory entry (16 bytes)
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt8(0, 2);         // no palette
    entry.writeUInt8(0, 3);         // reserved
    entry.writeUInt16LE(1, 4);      // color planes
    entry.writeUInt16LE(bpp, 6);    // bits per pixel
    entry.writeUInt32LE(totalImageSize, 8);
    entry.writeUInt32LE(6 + 16, 12); // offset

    // DIB header (BITMAPINFOHEADER)
    const dib = Buffer.alloc(dibHeaderSize);
    dib.writeUInt32LE(dibHeaderSize, 0);
    dib.writeInt32LE(size, 4);
    dib.writeInt32LE(size * 2, 8); // height * 2 for ICO
    dib.writeUInt16LE(1, 12);
    dib.writeUInt16LE(bpp, 14);
    dib.writeUInt32LE(0, 16);      // BI_RGB
    dib.writeUInt32LE(imageDataSize + maskSize, 20);

    // Pixel data (BGRA, bottom-up) — dark teal/cyan "N" on dark bg
    const pixels = Buffer.alloc(imageDataSize);

    // Letter "N" pattern (bottom-up in BMP)
    const N_PATTERN = [
        '................................',
        '..NNNN..................NNNN....',
        '..NNNNN.................NNNN....',
        '..NNNNNN................NNNN....',
        '..NNNNNNN...............NNNN....',
        '..NNNN.NNN..............NNNN....',
        '..NNNN..NNN.............NNNN....',
        '..NNNN...NNN............NNNN....',
        '..NNNN....NNN...........NNNN....',
        '..NNNN.....NNN..........NNNN....',
        '..NNNN......NNN.........NNNN....',
        '..NNNN.......NNN........NNNN....',
        '..NNNN........NNN.......NNNN....',
        '..NNNN.........NNN......NNNN....',
        '..NNNN..........NNN.....NNNN....',
        '..NNNN...........NNN....NNNN....',
        '..NNNN............NNN...NNNN....',
        '..NNNN.............NNN..NNNN....',
        '..NNNN..............NNN.NNNN....',
        '..NNNN...............NNNNNNN....',
        '..NNNN................NNNNNN....',
        '..NNNN.................NNNNN....',
        '..NNNN..................NNNN....',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
        '................................',
    ];

    for (let row = 0; row < size; row++) {
        // BMP is bottom-up: row 0 in buffer = bottom of image
        const patternRow = N_PATTERN[size - 1 - row] || '';
        for (let col = 0; col < size; col++) {
            const offset = (row * size + col) * 4;
            const ch = patternRow[col] || '.';
            if (ch === 'N') {
                // Gradient letter: purple top → cyan bottom
                const t = (size - 1 - row) / (size - 1); // 0=bottom, 1=top
                pixels[offset]     = Math.round(255 * (0.6 + 0.4 * t)); // B
                pixels[offset + 1] = Math.round(100 + 110 * t);          // G
                pixels[offset + 2] = Math.round(180 * (1 - t) + 30 * t); // R
                pixels[offset + 3] = 0xFF; // A
            } else {
                // Deep void background
                pixels[offset]     = 0x28; // B
                pixels[offset + 1] = 0x0F; // G
                pixels[offset + 2] = 0x0F; // R
                pixels[offset + 3] = 0xFF; // A
            }
        }
    }

    // AND mask (all opaque — zeros)
    const mask = Buffer.alloc(maskSize, 0);

    const ico = Buffer.concat([header, entry, dib, pixels, mask]);

    const outDir = path.join(__dirname, 'assets');
    const icoPath = path.join(outDir, 'ndjl.ico');
    const logoPath = path.join(outDir, 'ndjl-logo.ico');
    fs.writeFileSync(icoPath, ico);
    fs.writeFileSync(logoPath, ico);
    console.log(`ndjl.ico: ${ico.length} bytes (${size}x${size} 32-bit)`);
    console.log(`ndjl-logo.ico: copied`);
}

createICO();
