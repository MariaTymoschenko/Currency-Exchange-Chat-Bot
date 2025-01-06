import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CsvGraph = () => {
  const [data, setData] = useState([]);

  const fetchCsvData = async () => {
    try {
      const response = await fetch('/exchange_history/usduah.csv'); // Path to the CSV file in the public folder
      const csvText = await response.text();

      // Parse CSV data
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        transform: (value, field)  => {
            if (field === "Close") {
              return parseFloat(value.replace(",", ".")); // Handle numeric values with commas
            } else if (field === "Date") {
              // Parse Date field in dd.MM.yyyy format
              const [day, month, year] = value.split('.');
              return new Date(`${year}-${month}-${day}`); // Convert to yyyy-mm-dd format
            }
            return value; // Return other values unchanged
          },
        complete: (result) => {
          const formattedData = result.data.map((row) => ({
            ...row,
            Date: new Date(row.Date).toLocaleDateString("en-GB"), // Format the date
          }));
          setData(formattedData);
        },
      });
    } catch (error) {
      console.error("Error fetching or parsing CSV file:", error);
    }
  };

  useEffect(() => {
    fetchCsvData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="Close" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CsvGraph;
