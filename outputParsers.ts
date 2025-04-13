import {
  CommaSeparatedListOutputParser,
  JsonOutputParser,
  StringOutputParser,
  StructuredOutputParser,
} from '@langchain/core/output_parsers'
import { ChatPromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { ChatGroq } from '@langchain/groq'
import { z } from 'zod'

/**
 * LangChain has many types of output parsers. Below is a summary table:
 *
 * - Name: The name of the output parser
 * - Supports Streaming: Whether the output parser supports streaming
 * - Has Format Instructions: Whether the output parser has format instructions
 * - Calls LLM: Whether this output parser itself calls an LLM
 * - Input Type: Expected input type
 * - Output Type: The output type returned by the parser
 * - Description: Commentary on this output parser and when to use it
 */

interface Joke {
  body: string
  explanation: string
  rating: number
}

const jsonParser = new JsonOutputParser<Joke>()
const stringParser = new StringOutputParser()
const listParser = new CommaSeparatedListOutputParser()

const llm = new ChatGroq({
  model: 'llama-3.3-70b-versatile',
  temperature: 0.5,
})

const prompt = ChatPromptTemplate.fromMessages([
  ['system', `you are an ai assistant`],
  ['user', 'suggest 5 names saperated by commas for {input} '],
])

// const chain = RunnableSequence.from([
//   prompt,
//   // (prevResult) => console.log(prevResult),
//   llm,
//   listParser,
// ])

// const response = await chain.invoke({
//   input: 'cats',
// })

// console.log(response)

async function callStructuredOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
     formating instructions :{format}
      Phrase: {phrase}

      ## RETURN THE VALID JSON OBJECT AND NOTHING ELSE

    `)

  const structuredParser = StructuredOutputParser.fromNamesAndDescriptions({
    name: 'the name of the person',
    age: 'the age of the person',
    gender: 'the gender of the person male/female',
  })
  const chain = RunnableSequence.from([prompt, llm, structuredParser])
  // prompt.pipe(llm).pipe(structuredParser)

  const res = await chain.invoke({
    phrase: 'Omar is a 24 y/o man',
    format: structuredParser.getFormatInstructions(),
  })

  console.log(res)
}

async function callZodOutputParser() {
  const prompt = ChatPromptTemplate.fromTemplate(`
    Extract information from the following phrase.
     formating instructions :{format}
      Phrase: {phrase}

      ## RETURN THE VALID JSON OBJECT AND NOTHING ELSE

    `)

  const zod = z.object({
    recipe: z.string().describe('name of the recipe'),
    components: z.array(z.string()).describe('components of the recipe'),
  })

  const structuredParser = StructuredOutputParser.fromZodSchema(zod)
  const chain = RunnableSequence.from([prompt, llm, structuredParser])
  // prompt.pipe(llm).pipe(structuredParser)

  const res = await chain.invoke({
    phrase: 'The ingredients of a cake recipe',
    format: structuredParser.getFormatInstructions(),
  })

  console.log(res)
}

// callStructuredOutputParser()
callZodOutputParser()
