import {
  ChatGoogleGenerativeAI,
  GoogleGenerativeAIEmbeddings,
} from '@langchain/google-genai'
import { ChatGroq } from '@langchain/groq'
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

export async function callAgent(
  client: MongoClient,
  query: string,
  thread_id: string
) {
  const db_name = 'Cluster0'
  const db = client.db(db_name)
  const collection = db.collection('employees')

  // Fixed state definition to use 'messages' instead of 'message'
  const GraphState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
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
          model: 'text-embedding-004',
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
        n: z.number().optional().describe('Number of results to return'),
      }),
    }
  )

  const tools = [employeeLookupTool]
  const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools as any)

  const llm = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-pro',
    temperature: 0,
  }).bindTools(tools)

  // Updated to use 'messages' instead of 'message'
  async function callModel(state: typeof GraphState.State) {
    const prompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a helpful HR AI assistant. Use the provided tools to answer questions about employees. Format responses clearly and concisely.`,
      ],
      new MessagesPlaceholder('messages'),
    ])

    const formattedPrompt = await prompt.formatMessages({
      messages: state.messages,
    })

    const result = await llm.invoke(formattedPrompt)
    return { messages: [result] }
  }

  // Updated to use 'messages' instead of 'message'
  function shouldContinue(state: typeof GraphState.State) {
    const messages = state.messages
    const lastMessage = messages[messages.length - 1] as AIMessage

    if (lastMessage.tool_calls?.length) return 'tools'
    return '__end__'
  }

  const workFlow = new StateGraph(GraphState)
    .addNode('agent', callModel)
    .addNode('tools', toolNode)
    .addEdge('__start__', 'agent')
    .addConditionalEdges('agent', shouldContinue)
    .addEdge('tools', 'agent')

  const checkpointer = new MongoDBSaver({ client, dbName: db_name })

  const app = workFlow.compile({ checkpointer })

  // Updated to use 'messages' in the initial state
  const finalState = await app.invoke(
    {
      messages: [new HumanMessage(query)],
    },
    { recursionLimit: 15, configurable: { thread_id: thread_id } }
  )

  const finalMessage =
    finalState.messages[finalState.messages.length - 1].content
  console.log(finalMessage)
  return finalMessage
}
