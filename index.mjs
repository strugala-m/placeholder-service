import { createCanvas } from "canvas";
import { colord } from "colord";
import express from "express";
import sharp from "sharp";

// sharp config
sharp.simd(true);
sharp.concurrency(4);

// consts
const MIN_WIDTH = 1;
const MAX_WIDTH = 15360;
const MIN_HEIGHT = MIN_WIDTH;
const MAX_HEIGHT = MAX_WIDTH;
const DEFAULT_BACKGROUND = "fff";
const DEFAULT_FOREGROUND = "000";
const DEFAULT_FONT = "Segoe UI";
const APP_PORT = 80;

const app = express();

function parseColor(colorStr) {
    let color = colord(colorStr);
    if (!color.isValid()) {
        color = colord("#" + colorStr);
        if (!color.isValid()) {
            return;
        }
    }

    // Return color in BGRA, because the "canvas" module uses BGRA internally as opposed to regular RGBA, which "sharp" uses.
    const { r, g, b, a } = color.rgba;
    return colord({
        r: b,
        g: g,
        b: r,
        a: a,
    });
}

function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

app.get(/^\/(?<width>\d{1,5})(?:x(?<height>\d{1,5}))?$/, (req, res) => {
    let { width, height } = req.params;
    let {
        bg: background,
        fg: foreground,
        t: text,
        s: textScale,
    } = req.query;

    width = clamp(width, MIN_WIDTH, MAX_WIDTH);
    height ||= width;
    height = clamp(height, MIN_HEIGHT, MAX_HEIGHT);

    const backgroundColor = parseColor(background) || parseColor(DEFAULT_BACKGROUND);
    const foregroundColor = parseColor(foreground) || parseColor(DEFAULT_FOREGROUND);
    text ||= `${width}x${height}`;
    textScale ||= 1;

    const canvas = createCanvas(width, height);
    const context = canvas.getContext("2d", { alpha: false });

    context.fillStyle = backgroundColor.toHex();
    context.fillRect(0, 0, width, height);

    context.textAlign = "center";
    context.textBaseline = "middle";

    const fontSize = .15 * height * textScale;
    context.font = `${fontSize}px ${DEFAULT_FONT}`;

    context.fillStyle = foregroundColor.toHex();
    context.fillText(text, width * .5, height * .5);

    /* 
    "channels" is set to 4 because Cairo ("canvas") stores the values internally in float32, so "rawBuf" size is always multiple of four, no matter if alpha is used or not.
    */ 
    const rawBuf = canvas.toBuffer("raw");
    sharp(rawBuf, { raw: { width, height, channels: 4 } })
        .removeAlpha()
        .png()
        .toBuffer()
        .then(pngBuf => {
            res.setHeader("Content-Type", "image/png");
            res.send(pngBuf);
        });
});

app.listen(APP_PORT, () => {
    console.log(`Server listening on http://127.0.0.1:${APP_PORT}/`);
});