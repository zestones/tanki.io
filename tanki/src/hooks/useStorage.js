import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
    // Get stored value or use initialValue
    const getStoredValue = () => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    };

    // State to store our value
    const [storedValue, setStoredValue] = useState(getStoredValue);

    // Return a wrapped version of useState's setter function
    const setValue = (value) => {
        try {
            // Allow value to be a function
            const valueToStore = value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to localStorage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    // Update stored value if the key changes
    useEffect(() => {
        setStoredValue(getStoredValue());
    }, [key]);

    return [storedValue, setValue];
}

// A hook for working with sessionStorage
export function useSessionStorage(key, initialValue) {
    // Similar implementation but using sessionStorage
    const getStoredValue = () => {
        try {
            const item = window.sessionStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading sessionStorage key "${key}":`, error);
            return initialValue;
        }
    };

    const [storedValue, setStoredValue] = useState(getStoredValue);

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(`Error setting sessionStorage key "${key}":`, error);
        }
    };

    useEffect(() => {
        setStoredValue(getStoredValue());
    }, [key]);

    return [storedValue, setValue];
}