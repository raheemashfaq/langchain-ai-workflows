
import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableLambda } from "@langchain/core/runnables";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  temperature: 0,
});

const parser = new StringOutputParser();

const productChain = ChatPromptTemplate.fromTemplate(
  "Answer this product question clearly: {question}"
).pipe(model).pipe(parser);

const petCareChain = ChatPromptTemplate.fromTemplate(
  "Provide general pet-care information for this question: {question}. Mention when a veterinarian should be consulted."
).pipe(model).pipe(parser);

const orderChain = ChatPromptTemplate.fromTemplate(
  "Help the customer with their order-support question: {question}. Do not invent order status or claim to access order records."
).pipe(model).pipe(parser);

// Route the input to the appropriate chain.
const router = new RunnableLambda({
  func: async ({ question }) => {
    const text = question.toLowerCase();

    if (text.includes("order") || text.includes("delivery")) {
      return orderChain.invoke({ question });
    }

    if (
      text.includes("food") ||
      text.includes("symptom") ||
      text.includes("vaccination") ||
      text.includes("health")
    ) {
      return petCareChain.invoke({ question });
    }

    return productChain.invoke({ question });
  },
});

const result = await router.invoke({
  question: "How do I track my order?",
});

console.log(result);
