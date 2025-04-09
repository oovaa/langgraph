import { PromptTemplate } from '@langchain/core/prompts'

// const template = 'Tell me a {adjective} joke about {content}.'

// const promptTemplate = PromptTemplate.fromTemplate(template)
// console.log(promptTemplate.inputVariables) // i seeee
// // ['adjective', 'content']
// const formattedPromptTemplate = await promptTemplate.format({
//   adjective: 'funny',
//   //   content: 'chickens',
//   content: 'adasd',
// })
// console.log(formattedPromptTemplate)

// // An example prompt with no input variables
// const noInputPrompt = new PromptTemplate({
//   inputVariables: [],
//   template: 'Tell me a joke.',
// })
// const formattedNoInputPrompt = await noInputPrompt.format({})

// console.log(formattedNoInputPrompt)
// // "Tell me a joke."

// // An example prompt with one input variable
// const oneInputPrompt = new PromptTemplate({
//   inputVariables: ['adjective'],
//   template: 'Tell me a {adjective} joke.',
// })
// const formattedOneInputPrompt = await oneInputPrompt.format({
//   adjective: 'funny',
// })

// console.log(formattedOneInputPrompt)
// // "Tell me a funny joke."

// // An example prompt with multiple input variables
// const multipleInputPrompt = new PromptTemplate({
//   inputVariables: ['adjective', 'content'],
//   template: 'Tell me a {adjective} joke about {content}.',
// })
// const formattedMultipleInputPrompt = await multipleInputPrompt.format({
//   adjective: 'funny',
//   content: 'chickens',
// })

// console.log(formattedMultipleInputPrompt)
// "Tell me a funny joke about chickens."

// If a template is passed in, the input variables are inferred automatically from the template.
// const prompt = PromptTemplate.fromTemplate(
//   `You are a naming consultant for new companies.
// What is a good name for a company that makes {{product}}?`,
//   { templateFormat: 'mustache' } // double  {} for the input var
// )

// const formattedPrompt = await prompt.format({
//   product: 'colorful socks',
// })

// console.log(formattedPrompt)

/*
You are a naming consultant for new companies.
What is a good name for a company that makes colorful socks?
*/
