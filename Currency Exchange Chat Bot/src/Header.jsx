import React, { useState } from "react";

const App = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleTrashClick = () => {
    console.log("Trash button clicked: Clearing history...");
  };

  return (
    <header
      className="header p-3 d-flex justify-content-between align-items-center bd-navbar sticky-top"
      style={{ background: "rgb(9, 162, 70)", color: "rgb(255, 255, 255)" }}
    >
      <h1 className="name m-0">Currency Exchange Bot</h1>
      <div className="right-header d-flex align-items-center">
        {isSearchOpen && (
          <input
            type="text"
            placeholder="Search..."
            className="form-control me-2"
            style={{ width: "200px" }}
          />
        )}
        <button
          className="btn d-flex justify-content-center align-items-center me-2"
          style={{
            background: "rgba(213, 213, 213, 0.35)",
            color: "rgb(0, 0, 0)",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
          }}
          onClick={handleSearchClick}
        >
          <i
            className={`fa-2xl ${
              isSearchOpen ? "fa-solid fa-xmark" : "fa-solid fa-magnifying-glass"
            }`}
          ></i>
        </button>
        <button
          className="btn d-flex justify-content-center align-items-center"
          style={{
            background: "rgba(213, 213, 213, 0.35)",
            color: "rgb(0, 0, 0)",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
          }}
          onClick={handleTrashClick}
        >
          <i className="fa-regular fa-trash-can fa-2xl"></i>
        </button>
      </div>
    </header>
  );
};

export default App;
