import { StringOutputParser } from '@langchain/core/output_parsers'
import {
  RunnablePassthrough,
  RunnableSequence,
} from '@langchain/core/runnables'
import { llm } from './llm.ts'
import { PromptTemplate } from '@langchain/core/prompts'

const prompt = PromptTemplate.fromTemplate(
  'what is 30 by {num} '
  //   'what is 30 by {num} {originalInput}'
)
const prompt2 = PromptTemplate.fromTemplate(
  'this is the content {content} number {num}'
)

const chain = RunnableSequence.from([
  {
    num: new RunnablePassthrough(),
    originalInput: new RunnablePassthrough(), // Preserve original input if needed
  },

  {
    content: prompt,
    num: (originalInput) => originalInput.num, // Or you could use a fixed value like 123 here
  },
  {
    content: (pr) => pr.content, // prevResult
    num: (pr) => pr.num,
  },
  prompt2,
  // (prevResult) => console.log(prevResult),
  llm,
  new StringOutputParser(),
])

const re = await chain.invoke({ num: 2 }) // Or { num: 2 } if you want to pass an object

console.log(re)
