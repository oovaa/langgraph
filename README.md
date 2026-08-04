# LangGraph Experiments

[![LangGraph](https://img.shields.io/badge/LangGraph-LangChain-blue.svg)](https://github.com/langchain-ai/langgraph)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://python.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

> **LangGraph & LangChain Experiments** — Hands-on exploration of LangGraph for building stateful, multi-agent LLM applications.

---

## 🎯 Overview

Experimental repository for learning and prototyping with **LangGraph** — the library for building stateful, multi-actor applications with LLMs. Contains Jupyter notebooks, TypeScript experiments, and agent implementations.

---

## 📁 Contents

### 📓 Jupyter Notebooks (Learning)
| Notebook | Topic |
|----------|-------|
| `Build Smarter AI Apps Empower LLMs with LangChain.ipynb` | LangChain fundamentals |
| `In-Context Learning and Prompt Templates for Advanced AI.ipynb` | Prompt engineering patterns |

### 🧪 TypeScript Experiments
| File | Purpose |
|------|---------|
| `agent.ts` | Basic agent implementation |
| `chainrunnables.ts` | Runnable chains |
| `chatModels.ts` | Chat model integrations |
| `chainrunnables.ts` | LCEL chains |
| `FileLoaders.ts` | Document loading |
| `WebLoaders.ts` | Web content loading |
| `Retrieval.ts` | Retrieval strategies |

---

## 🛠 Tech Stack

| Category | Technologies |
|----------|--------------|
| **Framework** | LangGraph, LangChain |
| **Languages** | TypeScript, Python |
| **LLMs** | OpenAI, Anthropic, Local (Ollama) |
| **Notebooks** | Jupyter Lab |
| **Package Manager** | `bun` (TypeScript), `uv` (Python) |

---

## 🚀 Quick Start

```bash
git clone https://github.com/oovaa/langgraph.git
cd langgraph

# TypeScript experiments
bun install
bun run agent.ts

# Python notebooks
uv sync
jupyter lab
```

---

## 📚 Covered Concepts

| Concept | Implementation |
|---------|----------------|
| **StateGraph** | Defining nodes, edges, state schema |
| **Nodes** | LLM calls, tool calls, custom functions |
| **Edges** | Conditional, direct, mapping |
| **Memory** | Checkpointers, thread persistence |
| **Interrupts** | Human-in-the-loop patterns |
| **Multi-agent** | Supervisor, swarm, hierarchical |

---

## 📚 Learning Resources

- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [LangGraph Academy](https://academy.langchain.com/courses/langgraph)
- [LangChain YouTube](https://www.youtube.com/@LangChain)

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Omar Abdulrahim**  
GitHub: [@oovaa](https://github.com/oovaa)