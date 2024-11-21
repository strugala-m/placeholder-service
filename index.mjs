import express from "express";
import sharp from "sharp";

const PORT = 80;
const MIN_WIDTH = 1;
const MIN_HEIGHT = 1;
const MAX_WIDTH = 7680;
const MAX_HEIGHT = 7680;

// Helper function
function clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
}

const app = express();

app.get("/favicon.ico", (req, res) => {
    res.status(404).end();
});

app.get("/:size", async (req, res) => {
    const { size } = req.params;
    
    // Parsing provided values
    let [width, height] = size.split("x", 2).map(s => Number(s.trim()));
    if (!width) {
        res.status(400).end("Failed to parse placeholder parameters; Please provide the parameters in [width]x[height?] format");
    }

    // Clamping width and height
    width = clamp(width, MIN_WIDTH, MAX_WIDTH);
    height ||= width;
    height = clamp(height, MIN_HEIGHT, MAX_HEIGHT);

    // Generating placeholder image
    const inBuffer = Buffer.from([0xa6, 0xa6, 0xa6]);
    const params = { raw: { width: 1, height: 1, channels: 3 } };

    const outBuffer = await sharp(inBuffer, params)
        .resize({ width, height })
        .png()
        .toBuffer();

    // Server response
    res.setHeader("Content-Type", "image/png").send(outBuffer);
})

app.listen(PORT);