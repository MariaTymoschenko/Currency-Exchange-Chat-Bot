import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
// import ChatBot from './ChatBot';
import Header from './Header';
import Converter from './Converter';
import Trends from './Trends';

function App() {
  const [exchangeRates, setExchangeRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const response = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setExchangeRates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, []);



  return (
    <>
    <Router>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Converter />} />
        <Route path="/trends" element={<Trends />} />
      </Routes>
    </Router>
      {loading ? (
        <p>Loading exchange rates...</p>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <div>
          {/* < ChatBot></ChatBot> */}
          <h2>Exchange Rates</h2>
          <table>
            <thead>
              <tr>
                <th>Currency</th>
                <th>Rate</th>
                <th>Code</th>
              </tr>
            </thead>
            <tbody>
              {exchangeRates.map((rate) => (
                <tr key={rate.r030}>
                  <td>{rate.txt}</td>
                  <td>{rate.rate}</td>
                  <td>{rate.cc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default App
