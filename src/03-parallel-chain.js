
import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableParallel } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  temperature: 0,
});

const parser = new StringOutputParser();

const descriptionPrompt = ChatPromptTemplate.fromTemplate(
  "Write a concise product description for: {product}"
);

const sellingPointsPrompt = ChatPromptTemplate.fromTemplate(
  "Extract exactly three key selling points from this product: {product}"
);

const descriptionChain = descriptionPrompt
  .pipe(model)
  .pipe(parser);

const sellingPointsChain = sellingPointsPrompt
  .pipe(model)
  .pipe(parser);

const parallelChain = RunnableParallel.from({
  description: descriptionChain,
  sellingPoints: sellingPointsChain,
});

const result = await parallelChain.invoke({
  product: "Premium dog food with chicken and rice",
});

console.log("Description:", result.description);
console.log("Selling points:", result.sellingPoints);
