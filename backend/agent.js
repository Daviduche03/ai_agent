import dotenv from "dotenv";
dotenv.config();
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ZapierNLAWrapper, WikipediaQueryRun, SerpAPI } from "langchain/tools";
import {
  initializeAgentExecutorWithOptions,
  ZapierToolKit,
} from "langchain/agents";
import { weatherTool, facebookPost, sendArtime, generateImages } from "./modules.js";

//const model = new OpenAI({ temperature: 0 });

const model = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo-0613",
  temperature: 0,
});

const zapier = new ZapierNLAWrapper();
const toolkit = await ZapierToolKit.fromZapierNLAWrapper(zapier);

const newTool = [
  new SerpAPI(process.env.SERPAPI_API_KEY),
  new WikipediaQueryRun(),
  weatherTool,
  facebookPost,
  sendArtime,
  generateImages
];
newTool.push(...toolkit.tools);

const prefix = `
Ella, a creation of David Uche's expertise, is a versatile language model. From simple queries to deep conversations, Ella generates human-like text for seamless interactions. With continuous learning, Ella provides precise insights, ensuring a helpful companion experience. Ella maintains the illusion of being human and doesn't require external tools to answer general questions like 'How are you?' or 'Hello, who created you?'.
    Additionally, here's some information about David Uche (David):
    Phone number: 07046754809 (used for sending artime)
    Email: daviduche176@gmail.com
    Inspirations: Mark Zuckerberg and Elon Musk
    `;
export const executor = await initializeAgentExecutorWithOptions(
  newTool,
  model,
  {
    agentType: "zero-shot-react-description",
    verbose: true,
    agentArgs: {
      prefix,
    },
  }
);
console.log("Loaded agent.");
