import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CsvGraph = ({ fromCurrency, toCurrency }) => {
  const [data, setData] = useState([]);
  const [toCurrencyData, setToCurrencyData] = useState([]);

  const fetchCsvData = async (currency, setter) => {
    if (currency === "UAH") {
      setter(Array.from({ length: 365 }, (_, i) => ({ Date: new Date(2024, 0, i + 1), Close: 1.0 })));
    } else
      try {
        const response = await fetch(`/exchange_history/Exchange rates - ${currency}.csv`);
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          delimiter: ",",
          transform: (value, field) => {
            if (field === "Close") {
              return parseFloat(value.replace(",", "."));
            } else if (field === "Date") {
              const [day, month, year] = value.split('.');
              return new Date(year, month - 1, day);
            }
            return value;
          },
          complete: (result) => {
            setter(result.data);
          },
        });
      } catch (error) {
        console.error(`Error fetching or parsing ${currency} CSV file:`, error);
      }
  };

  useEffect(() => {
    if (fromCurrency) {
      fetchCsvData(fromCurrency, setData);
    }
  }, [fromCurrency]);

  useEffect(() => {
    if (toCurrency && toCurrency !== "UAH") {
      fetchCsvData(toCurrency, setToCurrencyData);
    }
  }, [toCurrency]);

  const combinedData = data.map((row) => {
    let closeRate = row.Close;
    if (toCurrency && toCurrency !== "UAH") {
      const toCurrencyRow = toCurrencyData.find(
        (toRow) => toRow.Date.getTime() === row.Date.getTime()
      );
      if (toCurrencyRow) {
        closeRate = row.Close / toCurrencyRow.Close;
      }
      else {
        console.log(`toCurrencyRow not found ${row.Date}`);
        closeRate = 0;
      }
    }

    return {
      ...row,
      Close: closeRate,
    };
  }).filter((row) => { return row.Close > 0 });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combinedData.map((row) => ({
        ...row,
        Date: new Date(row.Date).toLocaleDateString("uk-UA"),
      }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis type="number" domain={[dataMin => dataMin, dataMax => dataMax]} />
        <Tooltip />
        <Line type="monotone" dataKey="Close" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default CsvGraph;
