import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, ImageOverlay } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const WeatherMap = () => {
  const [radarData, setRadarData] = useState(null);
  const [bounds, setBounds] = useState([[37.5, -123], [38, -122]]); // Default bounds

  const fetchRadarData = async () => {
    try {
      const response = await fetch('/api/radar/image');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      console.log('Fetched radar data:', data); 
      setRadarData(data.image_url);
      setBounds([[37.5, -123], [38, -122]]); 
    } catch (error) {
      console.error('Error fetching radar data:', error);
    }
  };

  useEffect(() => {
    fetchRadarData(); 
    const interval = setInterval(fetchRadarData, 300000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[37.75, -122.5]} zoom={8} style={{ height: '75vh', width: '85vw' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {radarData && (
        <ImageOverlay
          url={radarData}
          bounds={bounds}
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
};

export default WeatherMap;
