import { JsonOutputParser } from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatGroq } from '@langchain/groq'

// Initialize the ChatGroq model
const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
  maxTokens: undefined,
  maxRetries: 2,
  // responseFormat: { type: "json_object" }, // Enable JSON mode
})

interface schema {
  Chatbots: string
  LLMs: string
}

const parser = new JsonOutputParser<schema>()

// Define the prompt
const prompt = ChatPromptTemplate.fromMessages([
  {
    role: 'system',
    content: 'You are a helpful assistant.',
  },
  {
    role: 'user',
    content:
      'Please provide the details of chatbots versus LLMs in JSON format. Use technical jargon in the output.',
  },
])

const chain = RunnableSequence.from([prompt, llm, parser])
//await llm.invoke(prompt,)

console.log(await chain.invoke({}))
