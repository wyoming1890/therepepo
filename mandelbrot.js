/**  
 *  autor: foqc
 *  github: foqc
 */
// noprotect
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;

let MAX_ITERATION = 1;
const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

// Starting complex plane boundaries
const INITIAL_REAL_SET = { start: -2, end: 1 };
const INITIAL_IMAGINARY_SET = { start: -1, end: 1 };
let REAL_SET = { ...INITIAL_REAL_SET };
let IMAGINARY_SET = { ...INITIAL_IMAGINARY_SET };
let ZoomOn = 1;
// Zoom parameters
let ZOOM_SPEED = 0.5; // Slower speed of zoom
let zoomFactor = 1; // Initial zoom factor

// Colors array, maintaining the first color as black
const colors = new Array(16).fill(0).map((_, i) => {
    if (i === 0) return '#000'; // Always black for points inside the Mandelbrot set
    return `#${((1 << 24) * Math.random() | 0).toString(16)}`; // Random colors for points outside
});

// Controls how many rows are drawn per frame for faster animation
const ROWS_PER_FRAME = 5;

function mandelbrot(c) {
    let z = { x: 0, y: 0 }, n = 0, p, d;
    do {
        p = {
            x: Math.pow(z.x, 2) - Math.pow(z.y, 2),
            y: 2 * z.x * z.y
        };
        z = {
            x: p.x + c.x,
            y: p.y + c.y
        };
        d = Math.sqrt(Math.pow(z.x, 2) + Math.pow(z.y, 2));
        n += 1;
    } while (d <= 2 && n < MAX_ITERATION);
    return [n, d <= 2]; // Return the number of iterations and if it's in the Mandelbrot set
}

function getColor(m, isMandelbrotSet) {
    // Return black for points in the Mandelbrot set
    if (isMandelbrotSet) {
        return '#000'; // Always black for points inside
    }
    // Return colors for points outside based on iteration count
    return colors[(m % colors.length - 1) + 1];
}

let topRow = 0;
let bottomRow = HEIGHT - 1;

function drawRow(y) {
    for (let i = 0; i < WIDTH; i++) {
        const complex = {
            x: REAL_SET.start + (i / WIDTH) * (REAL_SET.end - REAL_SET.start),
            y: IMAGINARY_SET.start + (y / HEIGHT) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
        };

        const [m, isMandelbrotSet] = mandelbrot(complex);
        ctx.fillStyle = getColor(m, isMandelbrotSet); // Set color based on whether it's in the set
        ctx.fillRect(i, y, 1, 1); // Draw pixel
    }
}

function animate() {
    // Draw from the top and bottom towards the center
    for (let i = 0; i < ROWS_PER_FRAME; i++) {
        // Draw top row moving down
        if (topRow < HEIGHT / 2) {
            drawRow(topRow);
            topRow += 1;
        }

        // Draw bottom row moving up
        if (bottomRow > HEIGHT / 2) {
            drawRow(bottomRow);
            bottomRow -= 1;
        }

        // When reaching the middle, reset rows and increase MAX_ITERATION
        if (topRow >= HEIGHT / 2 && bottomRow <= HEIGHT / 2) {
            topRow = 0;
            bottomRow = HEIGHT - 1;
            MAX_ITERATION++; // Increase iterations for next pass
            
            // Start zooming after 15 iterations
            if (MAX_ITERATION > 30 && ZoomOn == 1) {
                zoomFactor += ZOOM_SPEED; // Increase zoom factor
                ZOOM_SPEED *= 1.2
                // Update the complex plane boundaries for a right-side zoom
                REAL_SET.start = INITIAL_REAL_SET.start / zoomFactor - 0.743643; // Shift right by 0.3
                REAL_SET.end = INITIAL_REAL_SET.end / zoomFactor - 0.743643; // Shift right by 0.3
                IMAGINARY_SET.start = INITIAL_IMAGINARY_SET.start / zoomFactor + 0.186272;
                IMAGINARY_SET.end = INITIAL_IMAGINARY_SET.end / zoomFactor + 0.186272;
            }
                
        }
    }

    requestAnimationFrame(animate); // Continue the animation
}

// Start the animation
animate();
