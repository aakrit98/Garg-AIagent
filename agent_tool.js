import "dotenv/config";
import OpenAI from "openai";
import axios from "axios";
import { z } from "zod";
import {
  Agent,
  run,
  tool,
  setDefaultOpenAIClient,
  setOpenAIAPI,
  setTracingDisabled,
} from "@openai/agents";
import { Resend } from "resend"; 


const resend = new Resend(process.env.RESEND_API_KEY);

// Groq setup
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});
setDefaultOpenAIClient(client);
setOpenAIAPI("chat_completions");
setTracingDisabled(true);

const GetWeatherResultSchema = z.object({ 
  city : z.string().describe('name of the city'),
  degree: z.number().describe(' the degree celcius of the temp'), 
  condition: z.string().optional().describe('condition of the weather'),
});

const ResultSchema = z.object({ 
  message: z.string().describe("final response to the user"),
})

 
const getWeatherTool = tool({
  name: "get_weather",
  description: "Return the current weather for a given city",
  parameters: z.object({
    city: z.string().describe("name of the city"),
  }),
  execute: async ({ city }) => {
    const url = `https://wttr.in/${encodeURIComponent(city.toLowerCase())}?format=%C+%t`;
    const response = await axios.get(url, { responseType: "text" });
    return `The weather of ${city} is ${response.data}`;
  },
});


const sendEmailTool = tool({ 
    name : 'send_email' , 
    description : 'This tool send an email' ,
    parameters : z.object({ 
            toEmail : z.string().describe('email'),
            subject : z.string().describe('subject') ,
            body : z.string().describe('body of the email')
    }) ,
    execute: async  ({body , subject , toEmail}) => { 
      console.log("send_email with" , {toEmail , subject});
     const {data, error} = await resend.emails.send({  
     
        from: "onboarding@resend.dev" ,
        to:[toEmail],
        subject,
        text:body,
      }); 
 console.log("Resend response " , {data,error});
      if(error) { 
        return `Faile to send email ${error.mesage}`;
      } return `Email sent successfully to ${toEmail} (id:${data.id})`;
    }
})

const agent = new Agent({
  name: "Weather Agent",
  instructions:
    "You are an expert weather agent. You can fetch weather reports and send emails when asked.",
  model: "openai/gpt-oss-120b",
  tools: [getWeatherTool , sendEmailTool],
 // outputType : ResultSchema,
});

async function main(query = "") {
  try {
    const result = await run(agent, query);
    console.log("Result:", result.finalOutput);
  } catch (err) {
    console.error("Error:", err);
  }
}

main("Get the weather of Pokhara and email it to maharjanfreaky@gmail.com with subject 'Weather update'");


