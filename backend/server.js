import express from 'express';
import axios from 'axios';
import { createCanvas } from 'canvas';
import pako from 'pako';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS
app.use(cors());

const MRMS_URL = "https://mrms.ncep.noaa.gov/2D/ReflectivityAtLowestAltitude/MRMS_ReflectivityAtLowestAltitude.latest.grib2.gz";

app.get('/api/radar/image', async (req, res) => {
    console.log('Received request for radar image');
    
    try {
        // Fetch the latest GRIB2 file
        const response = await axios.get(MRMS_URL, { responseType: 'arraybuffer' });
        console.log('Fetched GRIB2 data successfully');

        // Decompress the GRIB2 file
        const decompressedData = pako.inflate(response.data);
        console.log('Decompressed GRIB2 data successfully');

        // Generate radar image directly from decompressed data
        const radarImageUrl = generateRadarImageFromGRIB(decompressedData);
        
        if (!radarImageUrl) {
            return res.status(404).send('Radar image not found');
        }

        res.json({ image_url: radarImageUrl });
    } catch (error) {
        console.error('Error processing radar image:', error.message); 
        res.status(500).send('An error occurred while processing radar image.');
    }
});

// Function to generate an image from raw GRIB2 data
function generateRadarImageFromGRIB(decompressedData) {
    // Assuming decompressedData is in a format that can be processed directly
    const width = 800;  // Set appropriate width
    const height = 600; // Set appropriate height

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    const imageData = ctx.createImageData(width, height);

    // Here you would convert decompressedData into radar values
    // For demonstration, filling with dummy data
    for (let i = 0; i < width * height; i++) {
        const value = Math.random() * 100; // Replace with actual radar values
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
    if (value < 0) return [0, 0, 0];   // Transparent for no data
    else if (value < 10) return [0, 0, 255];   // Light blue for low reflectivity
    else if (value < 30) return [0, 255, 0];   // Green for moderate reflectivity
    else if (value < 50) return [255, 255, 0]; // Yellow for high reflectivity
    else return [255, 0, 0];                 // Red for very high reflectivity
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
