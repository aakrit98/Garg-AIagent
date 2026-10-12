import "dotenv/config" ; 
import OpenAI from "openai";
import { setDefaultOpenAIClient, setOpenAIAPI , setTracingDisabled } from "@openai/agents";


const client = new OpenAI ({ 
    apiKey : process.env.GROQ_API_KEY ,
    baseURL : "https://api.groq.com/openai/v1",
});

setDefaultOpenAIClient(client);
setOpenAIAPI("chat_completions");
setTracingDisabled(true); 

export const MODEL = process.env.MODEL || "openai/gpt-oss-120b";

