
import "dotenv/config";

import { Document } from "@langchain/core/documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from "@langchain/google-genai";

import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

import {
  RunnableLambda,
  RunnablePassthrough,
} from "@langchain/core/runnables";

// ==========================================
// 1. Initialize embedding model
// ==========================================

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "gemini-embedding-001",
});

// ==========================================
// 2. Prepare sample knowledge documents
// ==========================================

const documents = [
  new Document({
    pageContent:
      "Dogs with sensitive stomachs may benefit from a consistent diet. Introduce dietary changes gradually and consult a veterinarian if digestive problems persist.",
    metadata: { topic: "dog nutrition" },
  }),

  new Document({
    pageContent:
      "Dogs need access to fresh, clean drinking water throughout the day. Monitor changes in drinking habits.",
    metadata: { topic: "hydration" },
  }),

  new Document({
    pageContent:
      "Regular grooming helps keep a dog's coat clean. Brush according to the dog's coat type and inspect the skin for irritation.",
    metadata: { topic: "grooming" },
  }),
];

// ==========================================
// 3. Create vector store and embed documents
// ==========================================

const vectorStore = await MemoryVectorStore.fromDocuments(
  documents,
  embeddings
);

console.log("Vector store created successfully!");

// ==========================================
// 4. Create retriever
// ==========================================

const retriever = vectorStore.asRetriever({
  k: 2,
});

// ==========================================
// 5. Initialize Gemini chat model
// ==========================================

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  temperature: 0,
});

// ==========================================
// 6. Create prompt template
// ==========================================

const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful pet-care information assistant.

Answer the question using only the provided context.

If the context does not contain enough information,
clearly say that the knowledge base does not contain
enough information to answer.

Do not invent facts.

Context:
{context}

Question:
{question}

Answer:
`);

// ==========================================
// 7. Retrieve and format documents
// ==========================================

const retrieveAndFormat = new RunnableLambda({
  func: async ({ question }) => {
    const docs = await retriever.invoke(question);

    console.log("\nRetrieved documents:");

    docs.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log("Topic:", doc.metadata.topic);
      console.log("Content:", doc.pageContent);
    });

    return docs
      .map((doc) => doc.pageContent)
      .join("\n\n");
  },
});

// ==========================================
// 8. Build complete RAG chain
// ==========================================

const ragChain = RunnablePassthrough.assign({
  context: retrieveAndFormat,
})
  .pipe(prompt)
  .pipe(model)
  .pipe(new StringOutputParser());

// ==========================================
// 9. Invoke complete RAG pipeline
// ==========================================

const question =
  "What should I do if my dog has digestive problems?";

console.log("\nUser Question:", question);

const answer = await ragChain.invoke({
  question,
});

// ==========================================
// 10. Display final answer
// ==========================================

console.log("\n========== FINAL ANSWER ==========\n");
console.log(answer);
