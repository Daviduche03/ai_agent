import axios from "axios";
import { DynamicTool } from "langchain/tools";
import dotenv from "dotenv";
dotenv.config();

const API_ACCESS_KEY = process.env.UNSPLASH_API;
const BASE_URL = process.env.UNSPLASH_URL;

export const weatherTool = new DynamicTool({
  name: "weather_tool",
  description: `Call this to get current weather condition of any place, use place as
    input. example: california, russia, new york`,
  func: async (place) => {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=4be18ce080958ef51855c236739d2144&units=metric`;
    const response = await axios.get(url);
    const result = response.data;
    const jsonString = JSON.stringify(result);
    return jsonString;
  },
});

//Upload to facebook
const UploadToFacebook = async (body) => {
  try {
    const url = "https://graph.facebook.com/100287699733096/photos";
    const data = {
      url: "https://res.cloudinary.com/dmimllwek/image/upload/v1692261366/en2zxjr2fza1j3iku4ps.png",
      message: body,
      access_token: process.env.PAGE_ACCESS_TOKEN,
    };

    const response = await axios.post(url, data);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

//Random images
const searchImages = async (query) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/photos`, {
      headers: {
        Authorization: `Client-ID ${API_ACCESS_KEY}`,
      },
      params: {
        query,
      },
    });
    const images = response.data.results;
    const randomImage = Math.floor(Math.random() * images.length);

    return images[randomImage].urls.full;
  } catch (error) {
    console.error(error);
  }
};

export const facebookPost = new DynamicTool({
  name: "facebook_post",
  description: `Call this to make a facebook post on a page, use post body as
  input`,
  func: async (body) => {
    const res = await UploadToFacebook(body);
    const jsonString = JSON.stringify(res);
    return jsonString;
  },
});

const artime = async (amount, number) => {
  const headers = {
    Authorization:
      "Basic ZGF2aWR1Y2hlMTc2QGdtYWlsLmNvbTppVnFkUjlsZWtFcGNNZ0tXMERuUVRlWHh4NWhhQnlSTnZCTjVKTFBJRE5IMW84Ug==",
  };

  const url = `http://bigsub.com.ng/api/airtime.php?number=${number}&network=1&amount=${amount}`;

  try {
    const response = await axios.get(url, {
      headers,
      httpsAgent: { rejectUnauthorized: false },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
};

export const sendArtime = new DynamicTool({
  name: "send_airtime",
  description: `Call this to send airtime to someone, input should be an array containing artime amount and user's phone number eg: [50, 07046754809]`,
  func: async (array) => {
    console.log(array);
    const res = await artime(array[0], array[1]);
    const jsonString = JSON.stringify(res);
    return jsonString;
  },
});

const generateImage = async (prompt) => {
  try {
    const response = await axios.post(
      "https://dreamartify.onrender.com/api/v1/dalle",
      {
        prompt: prompt,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;
    return data;
  } catch (error) {
    // Handle error here
    console.log(error.message);
  }
};


export const generateImages = new DynamicTool({
  name: "generate_image",
  description: `Call this to generate image, input should prompt to generate the image`,
  func: async (prompt) => {
    console.log(prompt);
    const res = await generateImage(prompt);
    const jsonString = JSON.stringify(res);
    return jsonString;
  },
});
