
import "dotenv/config";

import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// 1. Load the text file
const loader = new TextLoader("./data/pet-care.txt");

const documents = await loader.load();

console.log("Loaded documents:", documents.length);

// 2. Create a text splitter
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 150,
  chunkOverlap: 30,
});

// 3. Split documents into chunks
const chunks = await splitter.splitDocuments(documents);

// 4. Display chunks
console.log("\nTotal chunks:", chunks.length);

chunks.forEach((chunk, index) => {
  console.log(`\nChunk ${index + 1}:`);
  console.log(chunk.pageContent);
  console.log("Metadata:", chunk.metadata);
});
