
import "dotenv/config";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";

import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

import {
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";

// 1. Initialize Gemini
const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.8-flash",
  temperature: 0,
});

// 2. Create a prompt with conversation history
const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful pet-care assistant. Use conversation history to understand the user."
  ],
  new MessagesPlaceholder("history"),
  ["human", "{input}"],
]);

// 3. Create a basic chain
const chain = prompt.pipe(model);

// 4. Create a store for conversation histories
const messageHistories = {};

// 5. Get or create history for a session
function getMessageHistory(sessionId) {
  if (!messageHistories[sessionId]) {
    messageHistories[sessionId] = new InMemoryChatMessageHistory();
  }

  return messageHistories[sessionId];
}

// 6. Wrap the chain with message history
const chainWithHistory = new RunnableWithMessageHistory({
  runnable: chain,
  getMessageHistory,
  inputMessagesKey: "input",
  historyMessagesKey: "history",
});

// 7. Define a session ID
const config = {
  configurable: {
    sessionId: "user-123",
  },
};

// 8. First conversation
const response1 = await chainWithHistory.invoke(
  {
    input: "My dog's name is Bruno and he is 2 years old.",
  },
  config
);

console.log("Assistant:", response1.content);

// 9. Second conversation
const response2 = await chainWithHistory.invoke(
  {
    input: "What is my dog's name and age?",
  },
  config
);

console.log("\nAssistant:", response2.content);

// 10. Inspect stored history
const history = await getMessageHistory("user-123").getMessages();

console.log("\nTotal messages stored:", history.length);
