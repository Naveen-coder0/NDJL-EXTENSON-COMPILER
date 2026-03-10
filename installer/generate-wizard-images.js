// ============================================================
// NDJL Installer — Premium Visual Asset Generator
// ============================================================
// Inno Setup 6 modern wizard exact sizes:
//   WizardImageFile:      164 x 314  (left panel on Welcome/Finish)
//   WizardSmallImageFile:  55 x 55   (top-right on inner pages)
// ============================================================

const fs = require('fs');
const path = require('path');

// ── BMP writer (24-bit, bottom-up) ───────────────────────
function createBMP(width, height, drawFn) {
    const rowBytes = width * 3;
    const rowPad = (4 - (rowBytes % 4)) % 4;
    const rowSize = rowBytes + rowPad;
    const pixelDataSize = rowSize * height;
    const fileSize = 54 + pixelDataSize;
    const buf = Buffer.alloc(fileSize, 0);
    buf.write('BM', 0);
    buf.writeUInt32LE(fileSize, 2);
    buf.writeUInt32LE(54, 10);
    buf.writeUInt32LE(40, 14);
    buf.writeInt32LE(width, 18);
    buf.writeInt32LE(height, 22);
    buf.writeUInt16LE(1, 26);
    buf.writeUInt16LE(24, 28);
    buf.writeUInt32LE(pixelDataSize, 34);
    buf.writeInt32LE(2835, 38);
    buf.writeInt32LE(2835, 42);
    for (let y = 0; y < height; y++) {
        const rowOff = 54 + (height - 1 - y) * rowSize;
        for (let x = 0; x < width; x++) {
            const [r, g, b] = drawFn(x, y, width, height);
            const px = rowOff + x * 3;
            buf[px]     = clamp(b);
            buf[px + 1] = clamp(g);
            buf[px + 2] = clamp(r);
        }
    }
    return buf;
}

function clamp(v) { return Math.max(0, Math.min(255, Math.round(v))); }
function lerp(a, b, t) { return a + (b - a) * t; }
function smoothstep(t) { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); }

// ── 5x7 pixel font ──────────────────────────────────────
const FONT = {
    N: ['1...1','11..1','11..1','1.1.1','1..11','1..11','1...1'],
    D: ['1111.','1...1','1...1','1...1','1...1','1...1','1111.'],
    J: ['..111','....1','....1','....1','1...1','1..1.','..1..'],
    L: ['1....','1....','1....','1....','1....','1....','11111'],
    v: ['.....','1...1','1...1','.1.1.','.1.1.','..1..','..1..'],
    1: ['..1..','..1..','.11..','..1..','..1..','..1..','..1..'],
    0: ['.111.','1...1','1..11','1.1.1','11..1','1...1','.111.'],
    '.': ['.....','.....','.....','.....','.....','..1..','..1..'],
};

function getPixelInText(text, textCenterX, textTopY, px, py, scale) {
    const charW = 5 * scale;
    const charH = 7 * scale;
    const gap = Math.max(1, Math.floor(scale * 0.6));
    const totalW = text.length * (charW + gap) - gap;
    const startX = textCenterX - totalW / 2;
    for (let ci = 0; ci < text.length; ci++) {
        const glyph = FONT[text[ci]];
        if (!glyph) continue;
        const cx = startX + ci * (charW + gap);
        const lx = Math.floor((px - cx) / scale);
        const ly = Math.floor((py - textTopY) / scale);
        if (lx >= 0 && lx < 5 && ly >= 0 && ly < 7 && glyph[ly] && glyph[ly][lx] === '1') {
            return true;
        }
    }
    return false;
}

// ══════════════════════════════════════════════════════════
// LARGE PANEL (164 x 314) — Welcome & Finish left sidebar
// Premium gradient: deep purple → electric blue → cyan
// Floating orbs, "NDJL" wordmark, version tag
// ══════════════════════════════════════════════════════════
function drawLargePanel(x, y, w, h) {
    const tx = x / w;
    const ty = y / h;

    // ── Base gradient: diagonal purple→blue→teal ─────────
    const gr = lerp(15, 8, ty) + lerp(0, 12, tx);
    const gg = lerp(10, 30, ty) + lerp(0, 25, tx);
    const gb = lerp(40, 65, ty) + lerp(0, 15, tx);
    let r = gr, g = gg, b = gb;

    // ── Glowing orb 1 (top-right, purple/magenta) ────────
    const o1x = w * 0.75, o1y = h * 0.15, o1r = 90;
    const d1 = Math.sqrt((x - o1x) ** 2 + (y - o1y) ** 2);
    if (d1 < o1r) {
        const t = smoothstep(1 - d1 / o1r);
        const intensity = t * 0.55;
        r = lerp(r, 180, intensity);
        g = lerp(g, 50, intensity);
        b = lerp(b, 220, intensity);
    }

    // ── Glowing orb 2 (center-left, electric blue) ───────
    const o2x = w * 0.2, o2y = h * 0.48, o2r = 100;
    const d2 = Math.sqrt((x - o2x) ** 2 + (y - o2y) ** 2);
    if (d2 < o2r) {
        const t = smoothstep(1 - d2 / o2r);
        const intensity = t * 0.5;
        r = lerp(r, 30, intensity);
        g = lerp(g, 120, intensity);
        b = lerp(b, 255, intensity);
    }

    // ── Glowing orb 3 (bottom, cyan/teal) ────────────────
    const o3x = w * 0.6, o3y = h * 0.82, o3r = 80;
    const d3 = Math.sqrt((x - o3x) ** 2 + (y - o3y) ** 2);
    if (d3 < o3r) {
        const t = smoothstep(1 - d3 / o3r);
        const intensity = t * 0.45;
        r = lerp(r, 0, intensity);
        g = lerp(g, 210, intensity);
        b = lerp(b, 230, intensity);
    }

    // ── Subtle grid/dot pattern ──────────────────────────
    if (x % 12 === 0 && y % 12 === 0) {
        const dotFade = 0.08 + 0.04 * Math.sin(x * 0.1) * Math.cos(y * 0.1);
        r += 255 * dotFade;
        g += 255 * dotFade;
        b += 255 * dotFade;
    }

    // ── Left accent bar (gradient stripe) ────────────────
    if (x < 3) {
        const barT = smoothstep(ty);
        r = lerp(130, 0, barT);
        g = lerp(60, 200, barT);
        b = lerp(230, 255, barT);
    }

    // ── "NDJL" wordmark (large, centered) ────────────────
    const textScale = 4;
    const textY = Math.floor(h * 0.38);
    const textCX = Math.floor(w / 2);
    if (getPixelInText('NDJL', textCX, textY, x, y, textScale)) {
        // White text with slight glow
        const dist = Math.abs(y - (textY + 3.5 * textScale)) / (3.5 * textScale);
        r = lerp(255, 220, dist);
        g = lerp(255, 230, dist);
        b = lerp(255, 255, dist);
    }

    // ── Glow behind text ─────────────────────────────────
    const glowCY = textY + 14;
    const glowDist = Math.sqrt(((x - textCX) * 0.8) ** 2 + (y - glowCY) ** 2);
    if (glowDist < 50 && !getPixelInText('NDJL', textCX, textY, x, y, textScale)) {
        const gt = smoothstep(1 - glowDist / 50) * 0.2;
        r = lerp(r, 100, gt);
        g = lerp(g, 160, gt);
        b = lerp(b, 255, gt);
    }

    // ── Accent line under text ───────────────────────────
    const lineY = textY + 7 * textScale + 10;
    const lineHW = 35;
    if (y >= lineY && y <= lineY + 1 && Math.abs(x - textCX) <= lineHW) {
        const lt = Math.abs(x - textCX) / lineHW;
        const fade = smoothstep(1 - lt);
        r = lerp(r, 100, fade * 0.9);
        g = lerp(g, 180, fade * 0.9);
        b = lerp(b, 255, fade * 0.9);
    }

    // ── "v1.0" version text ──────────────────────────────
    const verY = lineY + 14;
    if (getPixelInText('v1.0', textCX, verY, x, y, 1)) {
        r = lerp(r, 150, 0.7);
        g = lerp(g, 160, 0.7);
        b = lerp(b, 190, 0.7);
    }

    // ── Bottom gradient fade ─────────────────────────────
    if (ty > 0.9) {
        const ft = smoothstep((ty - 0.9) / 0.1);
        r = lerp(r, 8, ft * 0.6);
        g = lerp(g, 8, ft * 0.6);
        b = lerp(b, 20, ft * 0.6);
    }

    // ── Top gradient fade ────────────────────────────────
    if (ty < 0.05) {
        const ft = smoothstep(1 - ty / 0.05);
        r = lerp(r, 10, ft * 0.4);
        g = lerp(g, 8, ft * 0.4);
        b = lerp(b, 25, ft * 0.4);
    }

    return [r, g, b];
}

// ══════════════════════════════════════════════════════════
// SMALL LOGO (55 x 55) — Top-right on inner pages
// Compact "N" mark with gradient background
// ══════════════════════════════════════════════════════════
function drawSmallLogo(x, y, w, h) {
    const tx = x / w;
    const ty = y / h;

    // ── Background: matching gradient ────────────────────
    let r = lerp(15, 12, ty) + lerp(0, 8, tx);
    let g = lerp(12, 28, ty) + lerp(0, 15, tx);
    let b = lerp(38, 55, ty) + lerp(0, 10, tx);

    // ── Center glow (subtle blue) ────────────────────────
    const cx = w / 2, cy = h / 2;
    const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    const maxD = 30;
    if (dist < maxD) {
        const gt = smoothstep(1 - dist / maxD) * 0.35;
        r = lerp(r, 40, gt);
        g = lerp(g, 100, gt);
        b = lerp(b, 200, gt);
    }

    // ── "N" lettermark ───────────────────────────────────
    const scale = 5;
    const lw = 5 * scale;
    const lh = 7 * scale;
    const lx = Math.floor((w - lw) / 2);
    const ly = Math.floor((h - lh) / 2);
    const localX = Math.floor((x - lx) / scale);
    const localY = Math.floor((y - ly) / scale);

    if (localX >= 0 && localX < 5 && localY >= 0 && localY < 7) {
        const glyph = FONT.N;
        if (glyph[localY] && glyph[localY][localX] === '1') {
            // Gradient on letter: purple top → cyan bottom
            const letterT = localY / 6;
            r = lerp(180, 40, letterT);
            g = lerp(100, 210, letterT);
            b = lerp(255, 240, letterT);
        }
    }

    // ── Bottom accent line (2px) ─────────────────────────
    if (y >= h - 2) {
        const lt = smoothstep(tx);
        r = lerp(140, 0, lt);
        g = lerp(60, 200, lt);
        b = lerp(220, 240, lt);
    }

    return [r, g, b];
}

// ── Write all assets ─────────────────────────────────────
const outDir = path.join(__dirname, 'assets');

const large = createBMP(164, 314, drawLargePanel);
fs.writeFileSync(path.join(outDir, 'wizard-large.bmp'), large);
fs.writeFileSync(path.join(outDir, 'ndjl-banner.bmp'), large);
console.log('wizard-large.bmp  164x314  ' + large.length + ' bytes');

const small = createBMP(55, 55, drawSmallLogo);
fs.writeFileSync(path.join(outDir, 'wizard-small.bmp'), small);
fs.writeFileSync(path.join(outDir, 'ndjl-logo.bmp'), small);
console.log('wizard-small.bmp   55x55   ' + small.length + ' bytes');
