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

async function main() {
  try {
    // Create the prompt
    console.log('Creating the prompt...')
    const template = `You are a helpful and knowledgeable chatbot assistant. Answer the user's questions concisely and accurately based on the context.

    Context:
    {context}

    Question: 
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
    console.log(`Document loaded with ${docs.length} pages.`)

    // Chunk the document
    console.log('Splitting the document into chunks...')
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 300,
      chunkOverlap: 50, // Added some overlap for better context
    })

    const splitDocs = await textSplitter.splitDocuments(docs)
    const texts = splitDocs.map((doc) => doc.pageContent.replace(/\n/g, ' '))
    console.log(`Document split into ${texts.length} chunks.`)

    // Embed and create vector database
    console.log('Creating embeddings and vector database...')
    const embdModel = new CohereEmbeddings({ model: 'embed-english-v3.0' }) // Updated model
    const vdb = new MemoryVectorStore(embdModel)

    // Add documents with proper error handling
    try {
      await vdb.addDocuments(splitDocs)
      console.log('Documents added to vector store.')
    } catch (err) {
      console.error('Error adding documents to vector store:', err)
      throw err
    }

    // Create the retriever
    console.log('Creating the retriever...')
    const retriever = vdb.asRetriever({ k: 3 }) // Fixed spelling and increased k
    console.log('Retriever created.')

    // Create the chain
    console.log('Creating the chain...')
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString), // Format retrieved docs
        question: new RunnablePassthrough(),
      },
      prompt,
      llm,
    ])
    console.log('Chain created.')

    // Helper function to format documents
    function formatDocumentsAsString(docs: Document[]): string {
      return docs.map((doc) => doc.pageContent).join('\n\n')
    }

    // Test the chain
    const question = 'What is the main topic of the document?'
    console.log('Invoking the chain with question:', question)

    const response = await chain.invoke(question)
    console.log('Response:', response)
  } catch (error) {
    console.error('Error in main process:', error)
  }
}

// Run the main function
main()
