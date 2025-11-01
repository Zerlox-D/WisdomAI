import React, { useState,useEffect,useRef } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatContainerRef = useRef(null);
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async () => {
    if (!query.trim()) return;

    setLoading(true);

    try {
      const apiKey = "AIzaSyA-2vUiUNapBpY_RkCCEd1Pn29p6OIeTkU";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            parts: [{ text: query }],
          },
        ],
      };

      const result = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await result.json();
      console.log(data);
      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

      setMessages((prev) => [
        ...prev,
        { query, response: generatedText },
      ]);
      setQuery("");
    } catch (error) {
      console.error("Error generating response:", error);
      setMessages((prev) => [
        ...prev,
        { query, response: "An error occurred. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="app-container">
      <h1>💭Wisdom.ai</h1>
      <div className="query-container">
        <div ref={chatContainerRef} className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message-box">
            <div className="user-message-box">
              <div className="user-message">
                {msg.query}
              </div>
            </div>
            <div className="ai-message-box">
              <div className="ai-message">
                {msg.response}
              </div>
            </div>
          </div>
        ))}
      </div>
        <textarea
          placeholder="Enter your prompt"
          value={query}
          onChange={handleQueryChange}
          className="query-input"
        ></textarea>
        <div className="button-container">
          <button onClick={handleClear} className="clear-button">
            Clear
          </button>
          <button onClick={handleSubmit} className="submit-button" disabled={loading}>
            {loading ? "..." : "→"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;