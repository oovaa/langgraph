import { llm } from './llm' // Assuming llm is correctly initialized elsewhere
import { PromptTemplate } from '@langchain/core/prompts'
import { Document } from '@langchain/core/documents' // Correct import path
import { CohereEmbeddings } from '@langchain/cohere'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { RunnableSequence } from '@langchain/core/runnables'
import { formatDocumentsAsString } from "langchain/util/document";
// Optional: If your LLM output needs parsing (e.g., from Chat Messages to string)
// import { StringOutputParser } from "@langchain/core/output_parsers";

// --- 1. Preparation Phase ---

// Read a doc
console.log('Loading the document...')
const fileName = 'Darajat.docx' // Ensure file exists
const loader = new DocxLoader(fileName)
const docs = await loader.load()
console.log('Document loaded.')

// Chunk the document
console.log('Splitting the document into chunks...')
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 0, // Consider a small overlap (e.g., 50)
})
const pageContents = docs.map((doc) => doc.pageContent).join('\n\n');
const texts = await textSplitter.splitText(pageContents);
console.log(`Document split into ${texts.length} chunks.`)

// Embed and create vector database
console.log('Creating embeddings and vector database...')
// Ensure COHERE_API_KEY is set in your environment
const embdModel = new CohereEmbeddings({ model: 'embed-english-v3.0' }); // Verify model name
const documentsToEmbed = texts.map((text) => new Document({ pageContent: text }));
const vdb = await MemoryVectorStore.fromDocuments(documentsToEmbed, embdModel);
console.log('Vector database created.')

// Create the retriever
console.log('Creating the retriever...')
const retriever = vdb.asRetriever({ k: 2 }); // Retrieve top 2 chunks
console.log('Retriever created.')

// --- 2. Retrieval Phase ---

const question = 'What is the main topic of the document?'
console.log('\nRetrieving relevant documents for question:', question)

// Directly invoke the retriever with the question string
const retrievedDocs = await retriever.invoke(question);
console.log('Retrieved documents:', retrievedDocs.length);
// console.log(retrievedDocs); // Optional: See the retrieved docs

// Format the retrieved documents into a single string context
const context = formatDocumentsAsString(retrievedDocs);
console.log('Formatted context ready.')
// console.log('Context:\n', context); // Optional: See the formatted context

// --- 3. Generation Phase ---

// Create the prompt template (same as before)
console.log('\nCreating the generation prompt template...')
const template = `You are a helpful and knowledgeable chatbot assistant. Answer the user's questions concisely and accurately base on the context.
context:
{context}
question:
{question}
Answer:
`
const prompt = PromptTemplate.fromTemplate(template)
console.log('Prompt template created.')

// Create a *simple* generation chain: Prompt -> LLM -> OutputParser (optional)
console.log('Creating the generation chain...')
const generationChain = RunnableSequence.from([
  prompt,
  llm,
  // Optional: Add an output parser if your llm object doesn't output strings directly
  // new StringOutputParser(),
]);
console.log('Generation chain created.');

// Invoke the generation chain with the prepared context and question
console.log('Invoking the generation chain...')
const response = await generationChain.invoke({
  context: context,       // Pass the formatted context string
  question: question      // Pass the original question string
});

console.log('\n--- Final Response ---')
console.log(response.content)