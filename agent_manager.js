import 'dotenv/config'; 
import { Agent , tool , run} from '@openai/agents'; 
import {z} from "zod"; 
import "./config.js"; 
import {MODEL} from "./config.js";


const fetchAvailablePlans = tool({
  name: "fetch_available_plans",
  description:
    "Fetches the available internet plans. Call this whenever the user asks about plans, prices or speeds.",
  parameters: z.object({
    max_price_npr: z
      .number()
      .nullable()
      .describe("optional maximum price in NPR; pass null to list all plans"),
  }),
  execute: async ({ max_price_npr }) => {
    const plans = [
      { plan_id: "1", price_npr: 499, speed: "30MB/S" },
      { plan_id: "2", price_npr: 799, speed: "100MB/S" },
      { plan_id: "3", price_npr: 999, speed: "300MB/S" },
    ];
    return max_price_npr == null
      ? plans
      : plans.filter((p) => p.price_npr <= max_price_npr);
  },
});

const salesAgent = new Agent ({ 
    name: 'sales Agent',
    instructions : `you are an expoer sales agent for an internet broadband company.
    talk to the uer and help them with what they need` , 
    model : MODEL,
    tools: [fetchAvailablePlans]
})



async function runAgent(query = "") {
  try {
    const result = await run(salesAgent, query);
    console.log("output:", result.finalOutput);
  } catch (err) {
    console.error("Error:", err);
  }
}

runAgent("I had a plan 499 i need a refund right now my customer id is 30249");