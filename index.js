import 'dotenv/config';
import OpenAI from "openai";
import {
  Agent,
  run,
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from "@openai/agents";

// Point the SDK at Groq instead of OpenAI
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

setDefaultOpenAIClient(client);
setOpenAIAPI("chat_completions");
setTracingDisabled(true);

const helloAgent = new Agent({
  name: 'Hello Agent',
  instructions: 'You are an agent that always says hello world',
model: "openai/gpt-oss-120b",
});

run(helloAgent, 'Hey there, my name is aakrit')
  .then(result => {
    console.log(result.finalOutput);
  })
  .catch(err => {
    console.error("Error:", err);
  });