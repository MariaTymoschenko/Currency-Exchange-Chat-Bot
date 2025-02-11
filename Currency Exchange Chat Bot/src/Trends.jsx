import React, { useState } from "react";
import CsvGraph from "./CsvGraph";

const Trends = () => {
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("UAH");
  const currencies = ["USD", "EUR", "HUF", "CZK", "GBP", "PLN", "UAH"];

  const handleCurrency1Change = (e) => {
    setCurrency1(e.target.value);
  };

  const handleCurrency2Change = (e) => {
    setCurrency2(e.target.value);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "50px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <select
          style={{ padding: "10px", fontSize: "16px", marginRight: "10px" }}
          value={currency1}
          onChange={handleCurrency1Change}
        >
          <option value="" disabled>
            Select Currency
          </option>
          {currencies
            .filter((currency) => currency !== currency2)
            .map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>

        <i
          className="fa-solid fa-arrow-right"
          style={{ fontSize: "24px", margin: "0 10px" }}
        ></i>

        <select
          style={{ padding: "10px", fontSize: "16px" }}
          value={currency2}
          onChange={handleCurrency2Change}
        >
           <option value="" disabled>
            Select Currency
          </option>
          {currencies
            .filter((currency) => currency !== currency1)
            .map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
        </select>
      </div>
      {currency1 && currency2 && (
        <div style={{ marginTop: "30px", width: "80%" }}>
          <h2>
            Exchange Rate Graph: {currency1} to {currency2}
          </h2>
          <div
            style={{
              width: "100%",
              height: "400px",
              border: "1px solid #ccc",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
          <CsvGraph fromCurrency={currency1} toCurrency={currency2}/>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trends;
