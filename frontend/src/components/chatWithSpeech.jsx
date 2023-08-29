import React, { useState } from "react";
import { WhisperSTT } from "whisper-speech-to-text";

const whisper = new WhisperSTT("");

const ChatWidget = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  // Start recording audio
  const startRecord = async () => {
    const micSound = new Audio();
    micSound.src = "/sound1.mp3";
    micSound.play();
    await whisper.startRecording();
  };
  async function TextToSpeech(s) {
    const data = {
      text: s,
      voice_settings: { stability: 0, similarity_boost: 0 },
    };

    fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream",
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": "b5375eccd1c86335483fe1611b98d1ec",
        },
        body: JSON.stringify(data),
        responseType: "arraybuffer",
      }
    )
      .then((response) => response.arrayBuffer())
      .then((audioData) => {
        const oBlob = new Blob([audioData], { type: "audio/mpeg" });
        const audioURL = window.URL.createObjectURL(oBlob);
        const audio = new Audio();
        audio.src = audioURL;
        audio.play();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

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

  const stopRecord = () => {
    // Stop the recording and get the transcription
    whisper.stopRecording((text) => {
      console.log("Transcription:", text);
      fetchMessage(text)
        .then((res) => {
          console.log(res);
          TextToSpeech(res);
          const updatedMessages = [...messages, { user: text, bot: res }];
          setMessages(updatedMessages);
          setNewMessage("");
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  const handleSendMessage = () => {
    startRecord();
    if (newMessage.trim() === "") {
      return;
    }
    fetchMessage(newMessage)
      .then((res) => {
        console.log(res);
        const updatedMessages = [...messages, { user: newMessage, bot: res }];
        setMessages(updatedMessages);
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
        {messages.map((message, index) => (
          <div key={index}>
            <div className="bg-[#111] p-3 rounded-xl text-white">
              {message.user}
            </div>
            <div className="bg-[#fff] p-3 rounded-xl">{message.bot}</div>
          </div>
        ))}
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
        <button onClick={stopRecord}>stop</button>
      </div>
    </div>
  );
};

export default ChatWidget;
