import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './WeatherMap.css';

const colorLegend = [
    { value: '< 0', color: 'rgba(0, 0, 0, 0)', label: 'No Data' },
    { value: '0 - 5', color: 'rgba(230, 230, 255)', label: 'Very Low Reflectivity' },
    { value: '5 - 10', color: 'rgba(0, 0, 255)', label: 'Low Reflectivity' },
    { value: '10 - 20', color: 'rgba(0, 128, 255)', label: 'Low to Moderate Reflectivity' },
    { value: '20 - 30', color: 'rgba(0, 255, 0)', label: 'Moderate Reflectivity' },
    { value: '30 - 40', color: 'rgba(255, 255, 0)', label: 'Moderate to High Reflectivity' },
    { value: '40 - 50', color: 'rgba(255,165,0)', label: 'High Reflectivity' },
    { value: '50 - 60', color: 'rgba(255,0,0)', label: 'Very High Reflectivity' },
    { value: '60 - 70', color: 'rgba(128,0,128)', label: 'Extreme Reflectivity' },
    { value: '>70', color: 'rgba(255,20,147)', label: 'Maximum Reflectivity' },
];

const WeatherMap = () => {
    const [radarData, setRadarData] = useState(null);
    const [bounds] = useState([
        [24.396308, -125.0], // Bottom Left
        [49.384358, -66.93457] // Top Right
    ]);
    const [center] = useState([37.5, -95]); // Center of the USA
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRadarData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5001/api/radar/image?country=USA`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            console.log('Fetched radar data:', data);
            setRadarData(data.image_url);

        } catch (error) {
            console.error('Error fetching radar data:', error);
            setError('Failed to fetch radar data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRadarData();
        const interval = setInterval(fetchRadarData, 120000); // Refresh every 2 minutes
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="weather-map">
            {loading && <p>Loading radar data...</p>}
            {error && <p className="error-message">{error}</p>}

            <MapContainer center={center} zoom={4} style={{ height: '75vh', width: '85vw' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {radarData && (
                    <ImageOverlay
                        url={radarData}
                        bounds={bounds}
                        opacity={0.6} // Adjust the opacity to the radar image
                    />
                )}
            </MapContainer>

            {/* Legend Section */}
            <div className="legend">
                <h4>Reflectivity Levels</h4>
                <ul>
                    {colorLegend.map((entry) => (
                        <li key={entry.value} style={{ color: entry.color }}>
                            <span style={{ backgroundColor: entry.color }} className="legend-color-box"></span>
                            {entry.value}: {entry.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default WeatherMap;
