import { ChatGroq } from '@langchain/groq'

// Initialize the ChatGroq model
const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // responseFormat: { type: "json_object" }, // Enable JSON mode
})

// Define the prompt
const prompt = [
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
  {
    role: 'user',
    content: 'Please provide the details.',
  },
]

// Invoke the model with the prompt
const response = await llm.invoke(prompt)

// Output the response
console.log(response.content)
