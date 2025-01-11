import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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

    const toggleMenu = (event) => {
        event.stopPropagation();
        setIsMenuOpen(!isMenuOpen);
    };

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

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    return (
        <header
        className="header p-3 d-flex justify-content-start align-items-start bd-navbar sticky-top"
        style={{
          background: "rgb(9, 162, 70)",
          color: "rgb(255, 255, 255)",
        }}
      >
        <div className="left-header d-flex align-items-center">
          <button
            className="btn d-flex justify-content-center align-items-center me-3"
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
                        background: "rgb(54, 186, 96)",
                        boxShadow: "2px 0 5px rgba(0,0,0,0.5)",
                        zIndex: "1",
                        padding: "20px",
                    }}
                >
                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{ marginBottom: "20px" }}
                    >
                        <h2 style={{ margin: 0 }}>Menu</h2>
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
                            <Link to="/" className="nav-link" activeClassName="active" style={{ textDecoration: "underline", color: "black" }}>
<h5>                                Exchange Bot
</h5>                           </Link>
                        </li>
                        <li style={{ margin: "10px 0", cursor:"pointer" }}>
                            <Link to="/trends" style={{ textDecoration: "none", color: "black" }}>
                                <h5>Trends</h5>
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0", cursor: "pointer" }}>
                            <Link to="/map" style={{ textDecoration: "none", color: "black" }}>
                                <h5>Map of Banks nearby</h5>
                            </Link>
                        </li>
                        <li style={{ margin: "10px 0", cursor: "pointer" }}>
                            <Link to="/about" style={{ textDecoration: "none", color: "black" }}>
                                <h5>About</h5>
                            </Link>
                        </li>
                    </ul>
                </div>
            )}
             <div className="header-title">
             <h1 className="mb-0">{getTitle()}</h1>
             </div>
        </header>
    );
};

export default Header;
