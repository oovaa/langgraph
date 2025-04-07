import { OpenAIEmbeddings } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'
import { AIMessage, BaseMessage, HumanMessage } from '@langchain/core/messages'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { StateGraph } from '@langchain/langgraph'
import { Annotation } from '@langchain/langgraph'
import { tool } from '@langchain/core/tools'
import { ToolNode } from '@langchain/langgraph/prebuilt'
import { MongoDBSaver } from '@langchain/langgraph-checkpoint-mongodb'
import { MongoDBAtlasVectorSearch } from '@langchain/mongodb'
import { MongoClient } from 'mongodb'
import { z } from 'zod'
import 'dotenv/config'
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai'
import { ChatGroq } from '@langchain/groq'
import { stat } from 'fs'

export async function callAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  const db_name = 'Cluster0'
  const db = client.db(db_name)
  const collection = db.collection('employees')

  const GraphState = Annotation.Root({
    message: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
  })

  const employeeLookupTool = tool(
    async ({ query, n = 10 }) => {
      console.log('employee lookup tool called')

      const dbConfig = {
        collection,
        indexName: 'vector_index',
        textKey: 'embedding_text',
        embeddingKey: 'embedding',
      }

      const vectore_Store = new MongoDBAtlasVectorSearch(
        new GoogleGenerativeAIEmbeddings({
          model: 'text-embedding-004', // 768 dimensions
        }),
        dbConfig
      )

      const result = await vectore_Store.similaritySearchWithScore(query, n)
      return JSON.stringify(result)
    },
    {
      name: 'employee_lookup',
      description: 'Gathers employee details from the HR database',
      schema: z.object({
        query: z.string().describe('The search query'),
        n: z
          .number()
          .optional()
          .default(10)
          .describe('Number of results to return'),
      }),
    }
  )

  const tools = [employeeLookupTool]
  const toolNode = new ToolNode<typeof GraphState.State>(tools as any)

  const llm = new ChatGroq({
    model: 'llama-3.3-70b-versatile',
    temperature: 0,
  }).bindTools(tools)

  // Define the function that calls the model
  async function callModel(state: typeof GraphState.State) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a helpful AI assistant, collaborating with other assistants. Use the provided tools to progress towards answering the question. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off. Execute what you can to make progress. If you or any of the other assistants have the final answer or deliverable, prefix your response with FINAL ANSWER so the team knows to stop. You have access to the following tools: {tool_names}.\n{system_message}\nCurrent time: {time}.`,
      ],
      new MessagesPlaceholder('messages'),
    ])

    const formattedPrompt = await prompt.formatMessages({
      system_message: 'You are helpful HR Chatbot Agent.',
      time: new Date().toISOString(),
      tool_names: tools.map((tool) => tool.name).join(', '),
      messages: state.message,
    })

    const result = await llm.invoke(formattedPrompt)

    return { message: [result] as BaseMessage[] }
  }

  function shouldContiue(state: typeof GraphState.State) {
    const message = state.message
    const lastmessage = message[message.length - 1] as AIMessage

    if (lastmessage.tool_calls?.length) return 'tools'

    return '__end__'
  }

  const workFlow = new StateGraph(GraphState)
    .addNode('agent', callModel)
    .addNode('tools', toolNode)
    .addEdge('__start__', 'agent')
    .addConditionalEdges('agent', shouldContiue)
    .addEdge('tools', 'agent')

  const checkpointer = new MongoDBSaver({ client, dbName: db_name })

  const app = workFlow.compile({ checkpointer })

  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  )

  // console.log(JSON.stringify(finalState.messages, null, 2));
  console.log(finalState.messages[finalState.messages.length - 1].content)

  return finalState.messages[finalState.messages.length - 1].content
}
