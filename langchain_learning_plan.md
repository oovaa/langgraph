# 4-Week LangChain Mastery Plan (Free Models & Advanced Workflows)

This plan will guide you from the basics of LangChain to building complex, agentic workflows using free models. Each week concludes with a project to solidify your understanding.

---

### **Core Technology Stack**

*   **LLMs:** We will use models from the **Hugging Face Hub**. You will need a free Hugging Face account and an API token. These models are powerful and can be used for free via their inference API.
*   **Embeddings:** We will use `HuggingFaceEmbeddings`, which leverages the `sentence-transformers` library to run locally on your machine (no API key needed for this part).
*   **Vector Store:** We will use `ChromaDB` or `FAISS`, which are free, open-source, and run locally.

---

## Week 1: Core Fundamentals & The LangChain Expression Language (LCEL)

**Goal:** Understand the essential components of LangChain and how to compose them into simple, powerful chains using free Hugging Face models.

*   **Day 1: Setup & Models**
    *   **Topic:** Install LangChain and related libraries. Set up your `.env` file with your `HUGGINGFACEHUB_API_TOKEN`. Learn to use the `HuggingFaceHub` LLM class.
    *   **JS Docs:** [Integrations: Hugging Face Hub](https://js.langchain.com/docs/integrations/llms/huggingface_hub)
    *   **Task:** Write a script that takes a string input and gets a response from a free model on the Hugging Face Hub (e.g., `mistralai/Mistral-7B-Instruct-v0.1`).

*   **Day 2: Prompt Templates**
    *   **Topic:** Learn to create dynamic, reusable prompts with `PromptTemplate` and `ChatPromptTemplate`. Pay close attention to the specific prompt format required by your chosen free model.
    *   **JS Docs:** [Modules: Prompts](https://js.langchain.com/docs/modules/model_io/prompts/prompt_templates/)
    *   **Task:** Create a prompt template that takes a `topic` and a `style` and formats it correctly for your Hugging Face model.

*   **Day 3: Output Parsers**
    *   **Topic:** Learn how to transform the raw string output from an LLM into a more useful format.
    *   **JS Docs:** [Modules: Output Parsers](https://js.langchain.com/docs/modules/model_io/output_parsers/)
    *   **Task:** Use `StrOutputParser` to get a clean string and `JsonOutputParser` to get a JSON object. Note: Getting reliable JSON from smaller open models can be tricky and is a great learning exercise in prompt engineering.

*   **Day 4-5: Your First LCEL Chains**
    *   **Topic:** Master the LangChain Expression Language (LCEL) `|` (pipe) syntax. This is the fundamental way to build chains.
    *   **JS Docs:** [LangChain Expression Language (LCEL)](https://js.langchain.com/docs/expression_language/)
    *   **Task:** Create two chains:
        1.  `PromptTemplate | HuggingFaceHub | StrOutputParser`
        2.  A more complex chain that asks for a JSON output and uses `JsonOutputParser`.
    *   **Concept:** Understand how data flows through the chain, with the output of one component becoming the input of the next.

*   **Day 6-7: Weekly Project 1 - The Idea Generator**
    *   **Project:** Build a simple application that generates creative ideas using a free model.
    *   **Features:**
        1.  It should take a user's `topic` (e.g., "AI-powered gardening").
        2.  It should have a chain that generates a list of 3 potential app names for that topic.
        3.  It should have a second chain that, for each app name, generates a one-sentence pitch.
    *   **Outcome:** A script that you can run to brainstorm new ideas, demonstrating your grasp of the core components with free models.

---

## Week 2: Retrieval Augmented Generation (RAG) with Local Embeddings

**Goal:** Learn to connect your LLM to external data using free, locally-run embeddings, allowing it to answer questions about information it wasn't trained on.

*   **Day 8: Document Loaders & Text Splitters**
    *   **Topic:** Learn to ingest data from various sources and the importance of splitting it into manageable chunks.
    *   **JS Docs:** [Document Loaders](https://js.langchain.com/docs/modules/data_connection/document_loaders/) and [Text Splitters](https://js.langchain.com/docs/modules/data_connection/document_transformers/)
    *   **Task:** Write a script to load the content from a web article and a local text file, then split them into chunks of a specific size.

*   **Day 9-10: Local Embeddings & Vector Stores**
    *   **Topic:** Understand text embeddings. Use `HuggingFaceEmbeddings` to run a sentence-transformer model locally to create vectors. Store these in a local vector store like `ChromaDB`.
    *   **JS Docs:** [Hugging Face Embeddings](https://js.langchain.com/docs/integrations/text_embedding/huggingface_hub) and [Chroma Vector Store](https://js.langchain.com/docs/integrations/vectorstores/chroma)
    *   **Task:** Install `sentence-transformers` and `chromadb`. Modify your script to create embeddings for your text chunks and store them in a local ChromaDB database.

*   **Day 11: Retrievers**
    *   **Topic:** Learn how to create a `retriever` from your vector store. The retriever's job is to fetch the most relevant document chunks based on a query.
    *   **JS Docs:** [Retrievers](https://js.langchain.com/docs/modules/data_connection/retrievers/)
    *   **Task:** Create a retriever and test it by giving it a question. Print the content of the documents it retrieves.

*   **Day 12-13: Building the RAG Chain**
    *   **Topic:** Combine all the pieces into a complete RAG chain using your free LLM and local embeddings.
    *   **JS Docs:** [Chains: Vector DB QA](https://js.langchain.com/docs/modules/chains/popular/vector_db_qa)
    *   **Task:** Use LCEL to build the full RAG pipeline. The flow should be: `user question -> retriever -> format documents -> prompt -> HuggingFaceHub model -> output parser`.

*   **Day 14: Weekly Project 2 - "Docu-Chat"**
    *   **Project:** Build a Q&A chatbot for a specific document using only free and local tools.
    *   **Features:**
        1.  The user provides a URL to an article or a path to a local PDF.
        2.  Your application should load, split, and store the document in a local vector store using local embeddings.
        3.  The user can then ask questions, and the application will use its RAG chain to answer based *only* on the content of that document.
    *   **Outcome:** A powerful, private Q&A bot that demonstrates your ability to ground an LLM in external data without relying on paid services.

---

## Week 3: Agents, Tools, and Memory

**Goal:** Give your LLM application new capabilities by allowing it to use tools and remember past interactions, preparing you for complex workflow creation.

*   **Day 15-16: Creating Custom Tools**
    *   **Topic:** Learn how to turn any function into a tool that an agent can use. This is the foundation of building agents that can interact with the world.
    *   **JS Docs:** [Custom Tools](https://js.langchain.com/docs/modules/agents/tools/custom_tools)
    *   **Task:** Create several custom tools: a simple calculator, a function to get the current date, and a tool that can read a local file.

*   **Day 17-18: Building a ReAct Agent**
    *   **Topic:** Learn how to build a classic ReAct (Reasoning and Acting) agent. This involves creating a specific prompt that instructs the LLM to think step-by-step and decide which tool to use.
    *   **JS Docs:** [Agents](https://js.langchain.com/docs/modules/agents/)
    *   **Task:** Build an agent that has access to a web search tool (e.g., `TavilySearchResults`, which has a free tier) and your custom tools. Getting this to work reliably with open models is a key skill.

*   **Day 19: Memory**
    *   **Topic:** Learn how to add memory to your chains and agents to enable multi-turn conversations.
    *   **JS Docs:** [Memory](https://js.langchain.com/docs/modules/memory/)
    *   **Task:** Add memory to the agent you built on Day 17. Test that it can remember your name or previous questions.

*   **Day 20-21: Weekly Project 3 - The Smart Assistant**
    *   **Project:** Convert your RAG chain from Week 2 into a tool and build a more capable agent.
    *   **Features:**
        1.  Create an agent that has access to multiple tools: a web search tool, a calculator tool, and your "Docu-Chat" RAG chain from last week, which you will convert into a custom tool.
        2.  This agent should be able to reason about which tool to use to answer a question.
    *   **Outcome:** A powerful, multi-faceted assistant that can reason about which tool to use for a given task, a critical step towards building advanced workflows.

---

## Week 4: Building Advanced Agentic Workflows with LangGraph

**Goal:** Move beyond linear chains and agents to build complex, stateful, and cyclical applications with LangGraph, the key to creating advanced agents.

*   **Day 22-28: LangGraph Concepts & Final Project**
    *   **Topic:** Understand the core concepts of LangGraph: graphs, nodes, and edges. Learn how it allows for cycles and state management, which is impossible in standard LCEL chains.
    *   **Note:** LangGraph was originally a Python library. The concepts are identical, but the JS version (`langgraphjs`) is newer. The Python docs are excellent for understanding the "why" and the core ideas.
    *   **Conceptual Docs (Python):** [LangGraph Concepts](https://langchain-py.github.io/langgraph/)
    *   **Task & Project:** Go through the `langgraphjs` examples and build the **Final Project: The Multi-Agent Research Workflow**.
    *   **Features:**
        1.  **Graph Definition:** Design a graph with distinct nodes for each step of the workflow (Planner, Searcher, Writer).
        2.  **State Management:** Use a central state object to pass information between the nodes.
        3.  **Control Flow:** Use conditional edges to manage the workflow, allowing for loops and dynamic routing.
        4.  **Outcome:** A powerful, stateful agent that mimics a real research workflow, demonstrating your mastery of building and controlling advanced, cyclical agentic systems.
