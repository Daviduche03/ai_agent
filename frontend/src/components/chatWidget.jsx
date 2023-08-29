import React, { useState } from "react";

const ChatWidget = () => {
  const [message, setUserMessage] = useState("");
  const [botMessage, setBotMessage] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const fetchMessage = async (message) => {
    const url = "http://localhost:8000/api/v1/chat";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: message }),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === "") {
      return;
    }
    setUserMessage([...message, newMessage]);
    fetchMessage(newMessage)
      .then((res) => {
        console.log(res);

        setBotMessage([...botMessage, res]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div
        className="left-0 top-0 fixed w-[100%] font-extrabold text-black
      bg-white p-3 text-xl"
      >
        Assistant Ella
      </div>
      <div className="mt-12 p-2">
        <div>
          <div className="bg-[#111] p-3 rounded-xl text-white">{message}</div>

          <div className="bg-[#fff] p-3 rounded-xl">{botMessage}</div>
        </div>
      </div>
      <div className="bottom gap-2 flex justify-between">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          className="input"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWidget;
