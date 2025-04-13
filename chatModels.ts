import {
  JsonOutputParser,
  StringOutputParser,
} from '@langchain/core/output_parsers'
import { ChatGroq } from '@langchain/groq'

// 2. Create the parser from the Zod schema
const parser = new JsonOutputParser()

// 3. Initialize the ChatGroq model
const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0,
}).pipe(new StringOutputParser())

const respnese = await llm.batch(['hi ther', 'who are you', 'what is 4 + 5'])
console.log(respnese)
console.log(
  respnese.forEach((x) => {
    console.log(x)
  })
)

// const respnese = await llm.invoke('hi there tell me about you')

// console.log(respnese.content)

// const stream = await llm.stream(
//   'Write me a 1 verse song about goldfish on the moon'
// )

// for await (const chunk of stream) {
//   console.log(`${chunk.content} ---`)
// }

// // 4. Create the prompt using the format instructions
// const prompt = ChatPromptTemplate.fromMessages([
//   {
//     role: 'system',
//     content: 'You are a helpful assistant.',
//   },
//   {
//     role: 'user',
//     content: `Please provide a brief technical comparison between chatbots and LLMs in JSON format. Use technical language.`,
//   },
// ])

// // 5. Create the chain
// const chain = RunnableSequence.from([
//   prompt,

//   llm,
//   // (prevResult) => console.log(prevResult),
//   parser,
// ])

// // 6. Invoke the chain and log result
// const result = await chain.invoke({})
// console.log(result)
