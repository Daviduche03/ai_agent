import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { executor } from "./agent.js";
dotenv.config();

const app = express();
const allowedOrigins = [
  "https://ella-ai.vercel.app"
];

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = '8000';

app.get("/", async (req, res) => {
  
  res.status(200).json({
    "status": "200",
    "message": "Server online"
  })
});

app.post("/api/v1/chat", async (req, res) => {
  
  const input = req.body.prompt
  console.log(input);
  const result = await executor.call({ input });
  res.status(200).json(result.output)
});

app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
