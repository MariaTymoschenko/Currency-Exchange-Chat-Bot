import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MapComponent from "./MapComponent";

const BankMap = () => {
  return (
    <>
    <div>
      <h2>Map</h2>
      <MapComponent></MapComponent></div>
  </>
  );
};

export default BankMap;
