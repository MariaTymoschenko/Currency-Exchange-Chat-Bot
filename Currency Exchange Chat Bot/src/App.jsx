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
import BankMap from './BankMap';

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
      <div style={{ "height": "100vh" }} >
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Converter />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/map" element={<BankMap />} />
          </Routes>
        </Router></div>
    </>
  );
}

export default App
