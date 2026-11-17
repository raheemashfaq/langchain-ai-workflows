
import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
  temperature: 0,
});

const parser = new StringOutputParser();

// Step 1: Generate a product description
const descriptionPrompt = ChatPromptTemplate.fromTemplate(
  "Write a concise product description for: {product}"
);

const descriptionChain = descriptionPrompt
  .pipe(model)
  .pipe(parser);

// Step 2: Turn that description into a tagline
const taglinePrompt = ChatPromptTemplate.fromTemplate(
  "Create a catchy marketing tagline based on this description:\n{description}"
);

const taglineChain = taglinePrompt
  .pipe(model)
  .pipe(parser);

// Execute the steps sequentially
const description = await descriptionChain.invoke({
  product: "Premium dog food with chicken and rice",
});

const tagline = await taglineChain.invoke({
  description,
});

console.log("Description:", description);
console.log("Tagline:", tagline);
