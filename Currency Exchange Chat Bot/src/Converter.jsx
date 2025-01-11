import React, { useState, useEffect, useRef } from 'react';
import mySound from '/sounds/money-counter.mp3';

const CurrencyConverterBot = () => {
  const [currencies, setCurrencies] = useState([]);
  const [currencyMap, setCurrencyMap] = useState({});
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Please enter the amount you wish to convert.' },
  ]);
  const [userInput, setUserInput] = useState("");
  const [conversationStage, setConversationStage] = useState("enterAmount");
  const [conversionData, setConversionData] = useState({ amount: null, fromCurrency: null });
  const divRef = useRef(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch(
          'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
        );
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setCurrencies(data);
      } catch (error) {
        console.error('Error fetching currency data:', error);
      }
    };
    fetchCurrencies();
  }, []);

  useEffect(() => {
    const loadCurrencyNames = async () => {
      try {
        const response = await fetch('/currency_names.json');
        const data = await response.json();
        setCurrencyMap(data);
      } catch (error) {
        console.error('Error loading currency names:', error);
      }
    };
    loadCurrencyNames();
  }, []);

  useEffect(() => {
    divRef.current?.scrollTo({
      top: divRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleUserMessage = () => {

    const findCurrencyByInput = (input) => {
      input = input.toLowerCase();

      const match = currencyMap.find((currencyObj) => {
        const [name, code] = Object.entries(currencyObj)[0];
        return (
          code.toLowerCase() === input || 
          name.toLowerCase().includes(input)
        );
      });

      return match ? Object.values(match)[0] : null;
    };

    const sound = new Audio(mySound);
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);

    const input = userInput.toUpperCase();

    if (conversationStage === "enterAmount") {
      const amount = parseFloat(userInput);
      if (!isNaN(amount) && amount > 0) {
        setConversionData({ ...conversionData, amount });
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Please enter the currency you want to convert from (e.g., USD or "United States Dollar").' },
        ]);
        setConversationStage("enterFromCurrency");
      } else {
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Invalid amount. Please enter a valid number.' },
        ]);
      }
    } else if (conversationStage === "enterFromCurrency") {
      const fromCurrency = findCurrencyByInput(input);
      if (fromCurrency) {
        setConversionData({ ...conversionData, fromCurrency });
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Please enter the currency you want to convert to (e.g., EUR or "Euro").' },
        ]);
        setConversationStage("enterToCurrency");
      } else {
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Invalid currency. Please enter a valid one.' },
        ]);
      }
    } else if (conversationStage === "enterToCurrency") {
      const toCurrency = findCurrencyByInput(input);
      const { amount, fromCurrency } = conversionData;
      const fromRate =
        fromCurrency === 'UAH'
          ? 1
          : currencies.find((c) => c.cc === fromCurrency)?.rate;

      const toRate =
        toCurrency === 'UAH'
          ? 1
          : currencies.find((c) => c.cc === toCurrency)?.rate;

      if (fromRate && toRate) {
        const conversionResult = (amount * fromRate) / toRate;
        sound.play();
        setMessages([
          ...newMessages,
          {
            sender: 'bot',
            text: `${amount} ${fromCurrency} equals ${conversionResult.toFixed(2)} ${toCurrency}.`,
          },
        ]);
        setConversationStage("enterAmount");
        setConversionData({ amount: null, fromCurrency: null });
      } else {
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Invalid currency code. Please enter a valid currency.' },
        ]);
      }
    }

    setUserInput("");
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <video
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
        }}
        autoPlay
        loop
        muted
      >
        <source src="/animations/money (1).mp4" />
        Your browser does not support the video tag.
      </video>

      <div
        className="currency-converter-bot mx-auto p-3 border rounded"
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translate(-50%, 10%)',
          width: '50%',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          zIndex: 1,
        }}
      >
        <h2 className="text-center mb-4">Currency Converter Bot</h2>

        <div
          ref={divRef}
          className="chat-window rounded p-3 mb-3"
          style={{ height: '500px', overflowY: 'auto' }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`d-flex mb-3 ${message.sender === 'bot' ? 'justify-content-start' : 'justify-content-end'
                }`}
            >
              {message.sender === 'bot' && (
                <img
                  src="/imgs/icon.png"
                  alt="Bot Icon"
                  style={{ width: '30px', height: '30px', zIndex: 2, marginRight: '10px' }}
                />
              )}
              <div
                className={`msg-bubble p-2 rounded ${message.sender === 'bot' ? 'bg-primary text-white' : 'bg-light text-dark'
                  }`}
                style={{ maxWidth: '90%' }}
              >
                <p className="mb-0">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="input-group">
          <input
            type="text"
            className="form-control"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleUserMessage();
              }
            }}
            placeholder="Enter your message"
          />
          <button className="btn btn-primary" onClick={handleUserMessage}>
            Send <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverterBot;
