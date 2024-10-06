// import React, { createContext, useEffect, useState } from 'react';

// type WebSocketContextType = {
//   data: number[];
//   recent: string | null; // Add recent to store the latest 'yes' or 'no'
// };

// export const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

// export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [data, setData] = useState<number[]>(Array(6).fill(0)); // Initialize 6-hour "yes" count array
//   const [recent, setRecent] = useState<string | null>(null); // Add recent to hold the latest result

//   useEffect(() => {
//     const ws = new WebSocket('ws://10.48.183.102:8000/ws');

//     ws.onopen = () => {
//       console.log('Connected to WebSocket');
//     };

//     ws.onmessage = (e) => {
//       const result = e.data;

//       setRecent(result); // Store the latest 'yes' or 'no' result

//       if (result === '1') {
//         setData((prevData) => {
//           const newData = [...prevData];
//           newData[newData.length - 1]++; // Increment the count for the current hour
//           return newData;
//         });
//       }
//     };

//     ws.onerror = (error) => {
//       console.error('WebSocket Error:', error);
//     };

//     ws.onclose = () => {
//       console.log('WebSocket connection closed');
//     };

//     // Handle hourly shift (simulate shifting hours after every 60 minutes)
//     const interval = setInterval(() => {
//       setData((prevData) => {
//         const newData = prevData.slice(1); // Shift array left
//         newData.push(0); // Add new hour at the end
//         return newData;
//       });
//     }, 36000); // Shift data every hour (3600000 ms)

//     return () => {
//       ws.close();
//       clearInterval(interval);
//     };
//   }, []);
//   useEffect(() => {
//     console.log("recent state updated:", recent);
//   }, [recent]);
//   return (
//     <WebSocketContext.Provider value={{ data, recent }}>
//       {children}
//     </WebSocketContext.Provider>
//   );
// };
