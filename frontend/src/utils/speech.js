export const TextToSpeech = async (text) =>{
    const data = {
      text: text,
      voice_settings: { stability: 0, similarity_boost: 0 },
    };

    fetch(
      "https://api.elevenlabs.io/v1/text-to-speech/EXAVITQu4vr4xnSDxMaL/stream",
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": "",
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