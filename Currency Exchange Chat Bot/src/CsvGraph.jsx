import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CsvGraph = () => {
  const [data, setData] = useState([]);

  const parseCsvData = () => {
    const csvData = `
Date,Close
2.1.23,"0,09692436104"
03.01.2023 23:58:00,"0,09601402382"
04.01.2023 23:58:00,"0,09768857051"
05.01.2023 23:58:00,"0,09684074132"
06.01.2023 23:58:00,"0,09868538628"
08.01.2023 23:58:00,"0,0978051908"`;

    // Parse CSV data
    Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
      delimiter: ",",
      transform: (value, field) =>
        field === "Close" ? parseFloat(value.replace(",", ".")) : value,
      complete: (result) => {
        const formattedData = result.data.map((row) => ({
          ...row,
          Date: new Date(row.Date).toLocaleDateString("en-GB"), // Format the date
        }));
        setData(formattedData);
      },
    });
  };

  useEffect(() => {
    parseCsvData();
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
