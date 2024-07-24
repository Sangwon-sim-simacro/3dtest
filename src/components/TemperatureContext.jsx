import React, { createContext, useState, useContext } from 'react';

const TemperatureContext = createContext();

export const useTemperatures = () => useContext(TemperatureContext);

export const TemperatureProvider = ({ children }) => {
    const [temperatures, setTemperatures] = useState([]);
    const [currentDayIndex, setCurrentDayIndex] = useState(0);

    // Function to update temperatures, could be more complex
    const updateTemperatures = (newTemperatures) => {
        setTemperatures(newTemperatures);
    };

    return (
        <TemperatureContext.Provider value={{ temperatures, currentDayIndex, updateTemperatures }}>
            {children}
        </TemperatureContext.Provider>
    );
};