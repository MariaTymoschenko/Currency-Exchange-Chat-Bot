import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CsvGraph = ({ fromCurrency, toCurrency }) => {
  const [data, setData] = useState([]);
  const [toCurrencyData, setToCurrencyData] = useState([]);

  const fetchCsvData = async (currency, setter) => {
    try {
      const response = await fetch(`/exchange_history/Exchange rates - ${currency}.csv`);
      // console.log(`loaded ${currency}`);
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

   // console.log(`Currency checked ${fromCurrency} ${toCurrency} for`, row);

    // If the toCurrency is not UAH, apply the exchange rate transformation
    if (toCurrency && toCurrency !== "UAH") {
      // console.log("toCurrencyData", toCurrencyData)
      const toCurrencyRow = toCurrencyData.find(
        (toRow) => toRow.Date.getTime() === row.Date.getTime()
      );
      if (toCurrencyRow) {
        const toCurrencyClose = toCurrencyRow.Close;
        closeRate = row.Close / toCurrencyClose; // Combine the exchange rates
        // console.log(`toCurrencyRow Found ${closeRate}`);
      }
      else {
        // console.log(`toCurrencyRow not found ${row.Date}`);
      }
    }

    return {
      ...row,
      Close: closeRate,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={combinedData.map((row) => ({
            ...row,
            Date: new Date(row.Date).toLocaleDateString("uk-UA"),
          }))} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
