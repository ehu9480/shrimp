// WebSocketManager.tsx
import React, { createContext, useEffect, useState } from 'react';

// Create a context to share the WebSocket data
export const WebSocketContext = createContext<any>(null);

const WebSocketManager = ({ children }: { children: React.ReactNode }) => {
    const [yesCountQueue, setYesCountQueue] = useState<number[]>(Array(6).fill(0)); // Initialize the queue with 6 entries

    useEffect(() => {
        const ws = new WebSocket('ws://10.48.183.102:8000/ws');  // Update with your actual WebSocket URL

        let hourYesCount = 0;
        let hourInterval = setInterval(() => {
            // At the end of every hour, shift the queue and start fresh count
            setYesCountQueue((prevQueue) => {
                const newQueue = [...prevQueue.slice(1), hourYesCount];
                hourYesCount = 0; // Reset count for the new hour
                return newQueue;
            });
        }, 3600000); // 1 hour in milliseconds

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);
            if (data.result === 'yes') {
                hourYesCount++; // Increment the count for this hour
            }
        };

        ws.onopen = () => console.log('WebSocket connected');
        ws.onclose = () => console.log('WebSocket disconnected');
        ws.onerror = (e) => console.error('WebSocket error: ', e);

        return () => {
            ws.close();
            clearInterval(hourInterval); // Clean up interval on component unmount
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ yesCountQueue }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export default WebSocketManager;
