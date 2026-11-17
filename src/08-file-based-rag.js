
import "dotenv/config";

// Document loading
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";

// Text splitting
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Embeddings and LLM
import {
  GoogleGenerativeAIEmbeddings,
  ChatGoogleGenerativeAI,
} from "@langchain/google-genai";

// Vector store
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

// Prompt and output parser
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

// Runnables
import {
  RunnableLambda,
  RunnablePassthrough,
} from "@langchain/core/runnables";

// --------------------------------------
// STEP 1: LOAD DOCUMENT
// --------------------------------------

const loader = new TextLoader("./data/pet-care.txt");

const documents = await loader.load();

console.log("Loaded documents:", documents.length);

// --------------------------------------
// STEP 2: SPLIT DOCUMENT INTO CHUNKS
// --------------------------------------

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 50,
});

const chunks = await splitter.splitDocuments(documents);

console.log("Total chunks:", chunks.length);

// --------------------------------------
// STEP 3: INITIALIZE EMBEDDINGS
// --------------------------------------

const embeddings = new GoogleGenerativeAIEmbeddings({
  modelName: "gemini-embedding-001",
});

// --------------------------------------
// STEP 4: CREATE VECTOR STORE
// --------------------------------------

const vectorStore = await MemoryVectorStore.fromDocuments(
  chunks,
  embeddings
);

console.log("Vector store created successfully!");

// --------------------------------------
// STEP 5: CREATE RETRIEVER
// --------------------------------------

const retriever = vectorStore.asRetriever({
  k: 3,
});

// --------------------------------------
// STEP 6: INITIALIZE CHAT MODEL
// --------------------------------------

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.6-flash",
  temperature: 0,
});

// --------------------------------------
// STEP 7: CREATE PROMPT
// --------------------------------------

const prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful pet-care information assistant.

Answer the user's question using only the provided context.

If the context does not contain enough information,
clearly explain that the knowledge base does not contain
enough information to answer.

Do not invent facts.

Context:
{context}

Question:
{question}

Answer:
`);

// --------------------------------------
// STEP 8: RETRIEVE RELEVANT DOCUMENTS
// --------------------------------------

const retrieveAndFormat = new RunnableLambda({
  func: async ({ question }) => {
    const retrievedDocs = await retriever.invoke(question);

    console.log("\nRetrieved documents:");

    retrievedDocs.forEach((doc, index) => {
      console.log(`\nDocument ${index + 1}:`);
      console.log("Source:", doc.metadata.source);
      console.log("Content:", doc.pageContent);
    });

    return retrievedDocs
      .map((doc) => doc.pageContent)
      .join("\n\n");
  },
});

// --------------------------------------
// STEP 9: BUILD COMPLETE RAG CHAIN
// --------------------------------------

const ragChain = RunnablePassthrough.assign({
  context: retrieveAndFormat,
})
  .pipe(prompt)
  .pipe(model)
  .pipe(new StringOutputParser());

// --------------------------------------
// STEP 10: ASK A QUESTION
// --------------------------------------

const question = "What should I do if my dog has digestive problems?";

console.log("\nUser Question:", question);

const answer = await ragChain.invoke({
  question,
});

// --------------------------------------
// STEP 11: DISPLAY FINAL ANSWER
// --------------------------------------

console.log("\n========== FINAL ANSWER ==========\n");

console.log(answer);
