// import React, { useState } from "react";
// import "./ChatBot.css";

// const ChatBot = () => {
//   const [messages, setMessages] = useState([
//     { type: "bot", text: "Please input original currency and amount" },
//   ]);
//   const [input, setInput] = useState("");

//   const handleSendMessage = async () => {
//     if (!input.trim()) return;

//     const newMessages = [...messages, { type: "user", text: input }];
//     setMessages(newMessages);
//     setInput("");

//     try {
//       const response = await fetch("http://localhost:5000/exchange", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: input }),
//       });
//       const data = await response.json();
//       setMessages([...newMessages, { type: "bot", text: data.reply }]);
//     } catch (error) {
//       setMessages([
//         ...newMessages,
//         { type: "bot", text: "Error processing your request." },
//       ]);
//     }
//   };

//   return (
//     <div className="chat-container">
//       <div className="chat-header">Currency Exchange Bot</div>
//       <div className="chat-messages">
//         {messages.map((msg, index) => (
//           <div
//             key={index}
//             className={`chat-message ${msg.type === "bot" ? "bot" : "user"}`}
//           >
//             {msg.text}
//           </div>
//         ))}
//       </div>
//       <div className="chat-input">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           placeholder="Write your message to exchange currency"
//         />
//         <button onClick={handleSendMessage}>Send</button>
//       </div>
//     </div>
//   );
// };

// export default ChatBot;