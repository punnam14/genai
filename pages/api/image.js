import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            // Load the image
            const image = await loadImage(path.join(process.cwd(), 'public', 'test.jpg')); // Adjust the path to your image

            // Create a canvas
            const canvas = createCanvas(image.width, image.height);
            const ctx = canvas.getContext('2d');

            // Fill the canvas with text
            const text = "Your text goes here ".repeat(5000); // Repeat text to fill the canvas
            ctx.font = '10px Arial';
            ctx.fillStyle = '#000';
            fillTextMultiLine(ctx, text, 0, 10, image.width, 10);

            // Draw the image with a circular mask
            ctx.globalCompositeOperation = 'destination-in';
            ctx.beginPath();
            ctx.arc(image.width / 2, image.height / 2, image.width / 2, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();

            // Drawing the image over the text
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(image, 0, 0, image.width, image.height);

            // Convert canvas to image
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync('./public/result.png', buffer); // Save the image locally

            res.status(200).json({ message: 'Image processed successfully!' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to process image' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

function fillTextMultiLine(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}