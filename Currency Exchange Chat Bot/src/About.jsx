import React from 'react';

function About() {
    return (
        <div className="container-fluid mt-1 mb-4 p-3" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 className="mb-3 mb-md-5">About Our Website</h2>
            <p className="mb-4">Welcome to our Currency Exchange Chat Bot platform, your comprehensive tool for effortless currency conversion and financial insights. Here’s what you can explore on our website:</p>

            <h5 className="mb-3">Chat Bot for Currency Conversion</h5>
            <p className="mb-4">
                Our smart chatbot allows you to convert any amount into any of the supported currencies. Simply ask the bot, and it will instantly provide the conversion based on the latest exchange rates. We support a wide range of currencies, including but not limited to USD, EUR, GBP, AUD, and many more, with regular updates to ensure accuracy.
            </p>

            <h5 className="mb-3">Trends and Insights</h5>
            <p className="mb-4">
                Dive into detailed graphs showcasing the exchange rate tendencies of major currencies (USD, EUR, UAH, PLN, HUF, GBP, and CZK) over the past year (2024). These visual insights help you stay informed about market trends and make educated financial decisions.
            </p>

            <h5 className="mb-3">Map for Exchange Locations</h5>
            <p className="mb-4">
                Easily locate banks and money exchange offices near you where you can exchange money at competitive rates. Our interactive map ensures you find the most convenient and reliable options for your currency exchange needs.
            </p>

            <p>
                Whether you need a quick conversion, financial insights, or assistance finding an exchange location, our platform has everything you need for a seamless experience.
            </p>
        </div>
    );
}

export default About;
