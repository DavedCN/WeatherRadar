import { createCanvas } from 'canvas';
import pako from 'pako';
import grib2 from 'grib2'; // Import the grib2 library

function generateRadarImageFromGRIB(decompressedData) {
    const width = 800;  // Set appropriate width
    const height = 600; // Set appropriate height

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);

    // Parse the decompressed GRIB2 data
    const messages = grib2.decode(decompressedData); // Decode the GRIB2 data

    // Assuming we are interested in the first message for reflectivity values
    const reflectivityValues = messages[0].data; // This should contain the reflectivity values

    for (let i = 0; i < width * height; i++) {
        // Ensure we do not exceed the bounds of the reflectivityValues array
        const value = (i < reflectivityValues.length) ? reflectivityValues[i] : -1; // Use -1 for no data
        const color = valueToColor(value);

        imageData.data[i * 4] = color[0];     // R
        imageData.data[i * 4 + 1] = color[1]; // G
        imageData.data[i * 4 + 2] = color[2]; // B
        imageData.data[i * 4 + 3] = 255;      // A (fully opaque)
    }

    ctx.putImageData(imageData, 0, 0);
    
    return canvas.toDataURL(); // Return base64 encoded PNG image
}

// Function to convert reflectivity value to RGB color
function valueToColor(value) {
    if (value < 0) return [0, 0, 0]; // Transparent for no data
    else if (value < 5) return [230, 230, 255]; // Very light blue for very low reflectivity
    else if (value < 10) return [0, 0, 255];   // Light blue for low reflectivity
    else if (value < 20) return [0, 128, 255]; // Cyan for low to moderate reflectivity
    else if (value < 30) return [0, 255, 0];   // Green for moderate reflectivity
    else if (value < 40) return [255, 255, 0]; // Yellow for moderate to high reflectivity
    else if (value < 50) return [255, 165, 0]; // Orange for high reflectivity
    else if (value < 60) return [255, 0, 0];   // Red for very high reflectivity
    else if (value < 70) return [128, 0, 128]; // Purple for extreme reflectivity
    else return [255, 20, 147];                // Deep pink for maximum reflectivity
}
