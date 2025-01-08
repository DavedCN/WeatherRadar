import React from 'react';
import './App.css';
import WeatherMap from './components/WeatherMap';

const App = () => {
    return (
        <div className="App">
            <h1>Weather Radar Display</h1>
            <WeatherMap />
        </div>
    );
}

export default App;
