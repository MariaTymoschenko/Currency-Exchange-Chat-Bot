import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchHistory, setSearchHistory] = useState([]);
    const menuRef = useRef(null);
    const location = useLocation();

    const getTitle = ()=>{
        switch (location.pathname) {
            case '/':
              return 'Currency Exchange Bot';
            case '/trends':
              return 'Currency Exchange Trends';
            case '/map':
              return 'Currency Exchange Map';
            case '/about':
              return 'About Currency Exchange Bot';
            default:
              return 'Currency Exchange';
          }
        };

    const handleSearchClick = () => {
        setIsSearchOpen(!isSearchOpen);
    };

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSearch = () => {
        if (searchQuery && !searchHistory.includes(searchQuery)) {
            setSearchHistory([searchQuery, ...searchHistory]);
        }
    };

    const handleHistoryClick = (query) => {
        setSearchQuery(query);
    };

    const toggleMenu = (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to document
        setIsMenuOpen(!isMenuOpen);
    };

    // Close menu when clicking outside
    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener("click", handleOutsideClick);
        }

        return () => {
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [isMenuOpen]);

    // Close menu on page navigation
    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <header
            className="header p-3 d-flex justify-content-between align-items-center bd-navbar sticky-top"
            style={{ background: "rgb(9, 162, 70)", color: "rgb(255, 255, 255)" }}
        >
            <div className="left-header d-flex align-items-center">
                <button
                    className="btn d-flex justify-content-center align-items-center me-2"
                    style={{
                        background: "rgba(213, 213, 213, 0.35)",
                        color: "rgb(0, 0, 0)",
                        width: "50px",
                        height: "50px",
                        borderRadius: "50%",
                    }}
                    onClick={toggleMenu}
                >
                    <i
                        className={`fa-2xl ${isMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}`}
                        style={{ color: "rgb(0, 0, 0)" }}
                    ></i>
                </button>
                {/* <h1 className="name m-0">Currency Exchange Bot</h1> */}
            </div>
            <div className="right-header d-flex align-items-center">
                {isSearchOpen && (
                    <div style={{ position: "relative" }}>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="form-control me-2"
                            style={{ width: "200px" }}
                            value={searchQuery}
                            onChange={handleInputChange}
                            onBlur={handleSearch}
                        />
                        {searchQuery && (
                            <ul
                                style={{
                                    position: "absolute",
                                    top: "35px",
                                    left: "0",
                                    background: "white",
                                    border: "1px solid #ddd",
                                    width: "200px",
                                    maxHeight: "200px",
                                    overflowY: "auto",
                                    listStyleType: "none",
                                    padding: "5px",
                                    margin: "0",
                                }}
                            >
                                {searchHistory.map((historyItem, index) => (
                                    <li
                                        key={index}
                                        style={{
                                            padding: "5px",
                                            cursor: "pointer",
                                        }}
                                        onClick={() => handleHistoryClick(historyItem)}
                                    >
                                        {historyItem}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
                <button
                    className="btn d-flex justify-content-center align-items-center"
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
                        className={`fa-2xl ${isSearchOpen
                            ? "fa-solid fa-xmark"
                            : "fa-solid fa-magnifying-glass"
                            }`}
                        style={{ color: "rgb(0, 0, 0)" }}
                    ></i>
                </button>
            </div>
            {isMenuOpen && (
                <div
                    ref={menuRef}
                    style={{
                        position: "fixed",
                        top: "0",
                        left: "0",
                        height: "100%",
                        width: "250px",
                        background: "#bbb",
                        boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
                        zIndex: "1",
                        padding: "20px",
                    }}
                >
                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ marginBottom: "20px" }}
                    >
                        <h3 style={{ margin: 0 }}>Menu</h3>
                        <button
                            className="btn d-flex justify-content-center align-items-center"
                            style={{
                                background: "rgba(213, 213, 213, 0.35)",
                                color: "rgb(0, 0, 0)",
                                width: "40px",
                                height: "40px",
                                borderRadius: "50%",
                                zIndex: "10",
                            }}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <i className="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                    <ul
                        style={{
                            listStyleType: "none",
                            padding: "0",
                            margin: "0",
                        }}
                    >
                        <li style={{ margin: "10px 0", cursor: "pointer" }}>
                            <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                                <b>Exchange Bot</b>
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0", cursor:"pointer" }}>
                            <Link to="/trends" style={{ textDecoration: "none", color: "black" }}>
                                Trends
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0", cursor: "pointer" }}>
                            <Link to="/map" style={{ textDecoration: "none", color: "black" }}>
                                Map of Banks nearby
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0", cursor: "pointer" }}>
                            <Link to="/about" style={{ textDecoration: "none", color: "black" }}>
                                About
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
             <div className="header-title">
        <h1>{getTitle()}</h1>
      </div>
      {/* <div className="currency-exchange">
        <p>Currency Exchange Section</p>
      </div> */}
        </header>
    );
};

export default Header;
