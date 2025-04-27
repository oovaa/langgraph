import { llm } from './llm'
import { PromptTemplate } from '@langchain/core/prompts'
import { Document } from 'langchain/document'
import { CohereEmbeddings } from '@langchain/cohere'
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters'
import { DocxLoader } from '@langchain/community/document_loaders/fs/docx'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables'

// Create the prompt
console.log('Creating the prompt...')
const template = `You are a helpful and knowledgeable chatbot assistant. Answer the user's questions concisely and accurately base on the context.

context:
{context} 

questoin: 
{question}

Answer: 
`

const prompt = PromptTemplate.fromTemplate(template)
console.log('Prompt created.')

// Read a doc
console.log('Loading the document...')
const fileName = 'Darajat.docx'
const loader = new DocxLoader(fileName)
const docs = await loader.load()
console.log('Document loaded:', docs)

// Chunk the document
console.log('Splitting the document into chunks...')
const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 300,
  chunkOverlap: 0,
})
const texts = await textSplitter.splitText(
  docs.map((doc) => doc.pageContent.replace(/\n/g, ' ')).join('\n')
)
console.log('Document split into chunks:', texts)

// Embed and create vector database
console.log('Creating embeddings and vector database...')
const embdModel = new CohereEmbeddings({ model: 'embed-v4.0' })
const vdb = new MemoryVectorStore(embdModel)

for (const text of texts) {
  const document = new Document({ pageContent: text })
  vdb.addDocuments([document])
}
console.log('Vector database created.')

// Create the retriever
console.log('Creating the retriever...')
const retreiver = vdb.asRetriever({ k: 2 })
console.log('Retriever created.')

// Create the chain
console.log('Creating the chain...')
const chain = RunnableSequence.from([
  {
    context: retreiver,
    question: new RunnablePassthrough(),
  },
  prompt,
  llm,
])
console.log('Chain created.')

// Invoke the chain
const question = 'What is the main topic of the document?'
console.log('Invoking the chain with question:', question)
const response = await chain.invoke({ question })
console.log('Response:', response)
