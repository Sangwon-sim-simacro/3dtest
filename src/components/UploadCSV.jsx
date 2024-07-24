import React, { useState, useEffect } from 'react';
import { useTemperatures } from './TemperatureContext';

export const ButtonUploadCsv = () => {
    const [temperatures, setTemperatures] = useState([]);
    const [csvData, setCsvData] = useState([]);
    const [speed, setSpeed] = useState(0.5);
    const [currentDate, setCurrentDate] = useState(''); // Add state for current date
    const [currentDayIndex, setCurrentDayIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    // Get the context function to update temperatures
    const { updateTemperatures } = useTemperatures();

    const handleSpeedChange = (event) => {
        const newSpeed = event.target.value;
        setSpeed(isNaN(newSpeed) ? 5 : newSpeed); // Default to 5 seconds if input is not a number
    };

    const handleFileChange = (event) => {
        setIsLoading(true);
        const file = event.target.files[0];
        if (!file) {
            setIsLoading(false);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const csvData = e.target.result;
            const data = parseCSVData(csvData);
            setCsvData(data);
            setCurrentDayIndex(0); // Reset to the first day
            if (data.length > 0) {
                const firstDayTemperatures = extractTemperaturesForDay(data, 0);
                setTemperatures(firstDayTemperatures);
                updateTemperatures(firstDayTemperatures);
            }
            setIsLoading(false);
        };
        reader.readAsText(file);

        // Reset the value of the input so the same file can be uploaded again
        event.target.value = null;
    };

    const parseCSVData = (csvString) => {
        const rows = csvString.split("\n").map(row => row.split(","));
        return rows;
    };

    const extractTemperaturesForDay = (data, dayIndex) => {
        const dataRows = data.slice(1); // Skip the label row
        const dayColumnIndex = dayIndex + 1; // +1 to skip the label column

        if (dayColumnIndex >= data[0].length) return [];

        const date = data[0][dayColumnIndex]; // Extract the date from the header row
        setCurrentDate(date)

        return dataRows.map(row => {
            const tempString = row[dayColumnIndex];
            const tempValue = parseFloat(tempString);
            return isNaN(tempValue) ? null : tempValue;
        }).filter(value => value !== null);
    };

    useEffect(() => {
        let interval;
        if (csvData.length > 0 && currentDayIndex < csvData[0].length) {
            interval = setInterval(() => {
                const newTemperatures = extractTemperaturesForDay(csvData, currentDayIndex);
                setTemperatures(newTemperatures);
                updateTemperatures(newTemperatures);
                setCurrentDayIndex(currentIndex => currentIndex + 1);
            }, speed * 1000);
        }

        return () => clearInterval(interval);
    }, [csvData, currentDayIndex, speed]);

    return (
        <>
            <div style={{ marginBottom: "15px" }}>
                <span style={{ fontSize: "0.8rem", color: "#fff" }}>Simulation speed (seconds):</span>
                <input type="number" min="0" max="60" step="0.1" placeholder="Speed (seconds)" value={speed} onChange={handleSpeedChange} style={{ height: "20px", margin: "10px" }} />
                <input type="range" step="0.1" min="0" max="60" placeholder="Speed (seconds)" value={speed} onChange={handleSpeedChange} />
            </div>
            <div>
                <input type="file" className="file-input" id="file-input" name="file-input" onChange={handleFileChange} />
                <label className="file-input-label" htmlFor="file-input"
                >Select a File...</label>
            </div>
            <div style={{ overflowY: "auto", overflowX: "hidden" }}>
                {temperatures.length > 0 && <div className='csv-date'>{currentDate}</div>} {/* Display the date */}
                <ul>
                    {isLoading && <li>Loading Data...</li>}
                    {!isLoading && temperatures.length === 0 && <li>No data available.</li>}
                    {temperatures.map((temp, index) => (
                        <li key={index}>{temp}</li>
                    ))}
                </ul>
            </div>
        </>
    );
};
