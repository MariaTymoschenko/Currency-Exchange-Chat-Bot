import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import ChatBot from './ChatBot';
import Header from './Header';

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
      <Header></Header>
      <section className="dialog mx-auto my-5 p-3" style={{ width: "50%" }}>
  <div className="chat-response d-flex align-items-start justify-content-start mb-3">
    <div
      className="icon text-white rounded p-2 d-flex justify-content-center align-items-center"
      style={{ width: "35px", height: "35px" }}
    >
      <img
        src="/imgs/icon.png"
        alt="Bot Icon"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </div>
    <div className="msg-bubble bg-primary text-white rounded p-2 ms-2">
      <p className="mb-0">Please input original currency and amount</p>
    </div>
  </div>

  <div className="user-bubble d-flex justify-content-end mb-3">
    <div className="msg-bubble bg-light text-dark rounded p-2">
      <p className="mb-0">500 hryvnias</p>
    </div>
  </div>

  <div className="chat-response d-flex align-items-start justify-content-start mb-3">
    <div
      className="icon text-white rounded p-2 d-flex justify-content-center align-items-center"
      style={{ width: "35px", height: "35px" }}
    >
      <img
        src="/imgs/icon.png"
        alt="Bot Icon"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          borderRadius: "50%",
        }}
      />
    </div>
    <div className="msg-bubble bg-primary text-white rounded p-2 ms-2">
      <p className="mb-0">Please input original currency and amount</p>
    </div>
  </div>

  <div className="user-bubble d-flex justify-content-end mb-3">
    <div className="msg-bubble bg-light text-dark rounded p-2">
      <p className="mb-0">500 hryvnias</p>
    </div>
  </div>
</section>



<section 
  className="input-field mx-auto my-5 p-3 border rounded" 
  style={{ width: "50%" }}
>
  <div className="input-group mb-3">
    <input 
      type="text" 
      className="form-control" 
      placeholder="Write your message to exchange currency" 
      aria-label="Recipient's username" 
      aria-describedby="button-addon2" 
    />
    <button 
      className="btn btn-outline-secondary d-flex align-items-center" 
      type="button" 
      id="button-addon2"
    >
      Send <i className="fa-regular fa-paper-plane ms-2"></i>
    </button>
  </div>
</section>









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
