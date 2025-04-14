import { ChatGroq } from '@langchain/groq'

// Define LLM instance
export const llm: ChatGroq = new ChatGroq({
  model: 'llama3-70b-8192', // Updated model name
  temperature: 0,
})
