import React, { useState, useEffect } from 'react';

const CurrencyConverterBot = () => {
  // State to hold currency list fetched from the API
  const [currencies, setCurrencies] = useState([]);
  // State to hold chat messages
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Please enter the amount which you want to convert from.' },
  ]);
  // State to manage user input
  const [userInput, setUserInput] = useState("");
  // State to track the conversation stage
  const [conversationStage, setConversationStage] = useState("enterAmount");
  // Temporary storage for conversion data
  const [conversionData, setConversionData] = useState({ amount: null, fromCurrency: null });

  // Fetch currency data when the component mounts
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

  // Handle user messages and generate bot responses
  const handleUserMessage = () => {
    const newMessages = [...messages, { sender: 'user', text: userInput }];
    setMessages(newMessages);

    if (conversationStage === "enterAmount") {
      const amount = parseFloat(userInput);
      if (!isNaN(amount) && amount > 0) {
        setConversionData({ ...conversionData, amount });
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Please enter the currency you want to convert from (e.g., USD).' },
        ]);
        setConversationStage("enterFromCurrency");
      } else {
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Invalid amount. Please enter a valid number.' },
        ]);
      }
    } else if (conversationStage === "enterFromCurrency") {
      const fromCurrency = userInput.toUpperCase();
      if (currencies.find((c) => c.cc === fromCurrency) || fromCurrency === "UAH") {
        setConversionData({ ...conversionData, fromCurrency });
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Please enter the currency you want to convert to (e.g., EUR).' },
        ]);
        setConversationStage("enterToCurrency");
      } else {
        setMessages([
          ...newMessages,
          { sender: 'bot', text: 'Invalid currency code. Please enter a valid currency.' },
        ]);
      }
    } else if (conversationStage === "enterToCurrency") {
      const toCurrency = userInput.toUpperCase();
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
    <div className="currency-converter-bot mx-auto my-5 p-3 border rounded" style={{ width: '50%' }}>
      <h2 className="text-center mb-4">Currency Converter Bot</h2>

      {/* Chat window */}
      <div className="chat-window border rounded p-3 mb-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`d-flex mb-3 ${message.sender === 'bot' ? 'justify-content-start' : 'justify-content-end'}`}
          >
            {message.sender === 'bot' && (
              <img
                src="/imgs/icon.png"
                alt="Bot Icon"
                style={{ width: '30px', height: '30px', marginRight: '10px' }}
              />
            )}
            <div
              className={`msg-bubble p-2 rounded ${
                message.sender === 'bot' ? 'bg-primary text-white' : 'bg-light text-dark'
              }`}
              style={{ maxWidth: '70%' }}
            >
              <p className="mb-0">{message.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input field */}
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
  );
};

export default CurrencyConverterBot;
