import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CsvGraph = ({fileName}) => {
  const [data, setData] = useState([]);

  const fetchCsvData = async () => {
    try {
      const response = await fetch(`/exchange_history/Exchange rates - ${fileName}.csv`);
      const csvText = await response.text();

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        transform: (value, field)  => {
            if (field === "Close") {
              return parseFloat(value.replace(",", "."));
            } else if (field === "Date") {
              const [day, month, year] = value.split('.');
              return new Date(`${year}-${month}-${day}`);
            }
            return value;
          },
        complete: (result) => {
          const formattedData = result.data.map((row) => ({
            ...row,
            Date: new Date(row.Date).toLocaleDateString("en-GB"),
          }));
          setData(formattedData);
        },
      });
    } catch (error) {
      console.error("Error fetching or parsing CSV file:", error);
    }
  };

  useEffect(() => {
    if (fileName) {
      fetchCsvData();
    }
  }, [fileName]);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis type="number" domain={[dataMin =>dataMin, dataMax => dataMax ]} />
        <Tooltip />
        <Line type="monotone" dataKey="Close" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CsvGraph;
