import React, { useState, useEffect, useRef } from "react";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import { FiMaximize2, FiMinimize2, FiMinus } from "react-icons/fi";

function MediBot({ onClose, name = "MediBot" }) {
  // Default name is "MediBot"
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chat, setChat] = useState(null);
  const [error, setError] = useState(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const API_KEY = process.env.REACT_APP_CHATBOT_API_KEY;

  const MODEL_NAME = "gemini-1.0-pro-001";

  const genAI = new GoogleGenerativeAI(API_KEY);

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  useEffect(() => {
    const initChat = async () => {
      try {
        if (!API_KEY) {
          throw new Error("API key is missing");
        }
        console.log("Initializing chat...");
        const model = genAI.getGenerativeModel({ model: MODEL_NAME });
        const newChat = await model.startChat({
          generationConfig,
          safetySettings,
          history: [],
        });
        setChat(newChat);
        console.log("Chat initialized successfully");
      } catch (error) {
        console.error("Chat initialization error:", error);
        setError(`Failed to initialize chat: ${error.message}`);
      }
    };
    initChat();
  }, []);

  const handleSendMessage = async () => {
    try {
      const userMessage = {
        text: userInput,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setUserInput("");

      if (chat) {
        console.log("Sending message to AI:", userInput);

        const input_prompt = `You are a friendly and knowledgeable medical assistant chatbot named ${name}. Respond to the following message appropriately: ${userInput}`;
        const result = await chat.sendMessage(input_prompt);
        const botMessage = {
          text: result.response.text(),
          role: "bot",
          timestamp: new Date(),
        };

        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }
    } catch (error) {
      setError("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevents adding a new line in input field
      handleSendMessage();
    }
  };

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const chatContainerStyle = isMaximized
    ? {
        width: "80vw",
        height: "80vh",
        position: "fixed",
        top: "10vh",
        left: "10vw",
        zIndex: 1001,
      }
    : {
        width: "300px",
        height: "400px",
        position: "absolute",
        bottom: "80px",
        right: "0",
      };

  return (
    <div
      style={{
        ...chatContainerStyle,
        border: "1px solid #ccc",
        borderRadius: "10px",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "white",
        color: "black",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <h2 style={{ margin: 0, color: "#3498db" }}>
          {name} - Your friend here!
        </h2>{" "}
        {/* Display the chatbot's name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <button
            onClick={toggleMaximize}
            style={{
              background: "none",
              border: "none",
              fontSize: "13px",
              cursor: "pointer",
            }}
            title={isMaximized ? "Minimize" : "Maximize"}
          >
            {isMaximized ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              cursor: "pointer",
            }}
            title="Close"
          >
            <FiMinus />
          </button>
        </div>
      </div>
      <div
        ref={chatContainerRef}
        style={{
          flex: 1,
          overflowY: "auto",
          marginBottom: "10px",
          border: "1px solid #eee",
          padding: "10px",
          borderRadius: "5px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              marginBottom: "10px",
              textAlign: msg.role === "user" ? "right" : "left",
            }}
          >
            <span
              style={{
                backgroundColor: msg.role === "user" ? "#dcf8c6" : "#f2f2f2",
                padding: "8px 12px",
                borderRadius: "18px",
                display: "inline-block",
                maxWidth: "80%",
                wordWrap: "break-word",
                fontSize: isMaximized ? "16px" : "14px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
        {error && (
          <div style={{ color: "red", textAlign: "center" }}>{error}</div>
        )}
      </div>
      <div style={{ display: "flex" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{
            flex: 1,
            marginRight: "5px",
            padding: "8px",
            borderRadius: "20px",
            border: "1px solid #ccc",
            fontSize: isMaximized ? "16px" : "14px",
          }}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSendMessage}
          style={{
            padding: "8px 15px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: isMaximized ? "16px" : "14px",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default MediBot;
