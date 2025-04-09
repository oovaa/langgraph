import { MistralAI } from '@langchain/mistralai'

const llm = new MistralAI({
  model: 'codestral-latest',
  temperature: 0,
})

const inputText = 'MistralAI is an AI company that '

const completion = await llm.invoke(inputText)
console.log(completion)

// ok so this provides completion