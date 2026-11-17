import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  temperature: 0,
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful teaching assistant. Explain concepts simply."],
  ["human", "Explain {topic} in three bullet points."],
]);

const chain = prompt.pipe(model);

const response = await chain.invoke({
  topic: "What is LangChain?",
});

console.log(response.content);