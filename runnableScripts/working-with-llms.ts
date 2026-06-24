import "dotenv/config";

import { initChatModel } from "langchain/chat_models/universal";
import {
  HumanMessage,
  SystemMessage,
  BaseMessage,
  trimMessages,
} from "@langchain/core/messages";

/**
 * Concept 1:
 * Universal model initialization using initChatModel()
 *
 * Why this matters:
 * Instead of directly using ChatOpenAI or ChatAnthropic everywhere,
 * initChatModel gives us one common way to initialize chat models.
 *
 * LangChain can work with different providers through a unified API.
 */
async function demoChatModel() {
  console.log("\n==============================");
  console.log("1. Universal Chat Model Demo");
  console.log("==============================");

  const model = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0,
  });

  const response = await model.invoke(
    "What is the capital of France? Answer in one word."
  );

  console.log("OpenAI response:", response.content);

  /**
   * Optional provider switch:
   * If ANTHROPIC_API_KEY exists, use Claude as well.
   */
  if (process.env.ANTHROPIC_API_KEY) {
    const claude = await initChatModel("claude-3-5-sonnet-latest", {
      modelProvider: "anthropic",
      temperature: 0,
    });

    const claudeResponse = await claude.invoke(
      "What is the capital of France? Answer in one word."
    );

    console.log("Anthropic response:", claudeResponse.content);
  } else {
    console.log("Skipping Anthropic demo: ANTHROPIC_API_KEY not found.");
  }
}

/**
 * Concept 2:
 * Model comparison
 *
 * Why this matters:
 * In real AI/QA work, you may want to compare model behavior:
 * - speed
 * - cost
 * - answer quality
 * - consistency
 * - reasoning style
 *
 * Since LangChain chat models share a common interface,
 * we can invoke them in the same way.
 */
async function demoModelComparison() {
  console.log("\n==============================");
  console.log("2. Model Comparison Demo");
  console.log("==============================");

  const prompt = "Explain recursion in one sentence.";

  const models: Record<string, Awaited<ReturnType<typeof initChatModel>>> = {};

  models["OpenAI - GPT 4o Mini"] = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0,
  });

  if (process.env.ANTHROPIC_API_KEY) {
    models["Anthropic - Claude Sonnet"] = await initChatModel(
      "claude-3-5-sonnet-latest",
      {
        modelProvider: "anthropic",
        temperature: 0,
      }
    );
  }

  console.log("Prompt:", prompt);

  for (const [modelName, model] of Object.entries(models)) {
    try {
      const response = await model.invoke(prompt);
      console.log(`\n${modelName}:`);
      console.log(response.content);
    } catch (error) {
      console.error(`Error from ${modelName}:`, error);
    }
  }
}

/**
 * Concept 3:
 * Message objects
 *
 * Why this matters:
 * Instead of sending only a plain string,
 * we can send structured messages.
 *
 * A message can represent:
 * - system instruction
 * - human/user input
 * - AI response
 * - metadata
 *
 * This is better for chat workflows because LLMs understand conversations
 * as a sequence of messages.
 */
async function demoMessages() {
  console.log("\n==============================");
  console.log("3. SystemMessage + HumanMessage Demo");
  console.log("==============================");

  const model = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0,
  });

  const messages = [
    new SystemMessage(
      "You are a pirate and always answer like a pirate."
    ),
    new HumanMessage("What is the capital of France? Answer in one word."),
  ];

  const response = await model.invoke(messages);

  console.log("Response:", response.content);

  console.log("\nRaw message objects:");
  console.log(messages);
}

/**
 * Concept 4:
 * Multi-turn conversation using messages
 *
 * Why this matters:
 * A chatbot is not just one prompt.
 * It is usually a conversation history.
 *
 * We can keep appending:
 * - user messages
 * - AI responses
 *
 * Then the next model call has more context.
 */
async function demoMultiTurnConversation() {
  console.log("\n==============================");
  console.log("4. Multi-turn Conversation Demo");
  console.log("==============================");

  const model = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0.3,
  });

  const messages: BaseMessage[] = [
    new SystemMessage(
      "You are a pirate and always answer like a pirate."
    ),
    new HumanMessage("What is the weather like today?"),
  ];

  const firstResponse = await model.invoke(messages);

  console.log("First response:");
  console.log(firstResponse.content);

  /**
   * Add AI response back into the message history.
   * This gives the next call conversation context.
   */
  messages.push(firstResponse);

  /**
   * Add another user/human message.
   */
  messages.push(new HumanMessage("What about tomorrow?"));

  const secondResponse = await model.invoke(messages);

  console.log("\nFollow-up response:");
  console.log(secondResponse.content);

  console.log("\nConversation history now contains:");
  for (const message of messages) {
    console.log(`- ${message._getType()}: ${message.content}`);
  }
}

/**
 * Concept 5:
 * Token/cost optimization with message trimming
 *
 * Why this matters:
 * Long conversations become expensive.
 * Also, every model has a context limit.
 *
 * Message trimming helps keep only the important/recent messages.
 *
 * LangChain supports trimming messages so conversation history
 * stays below a token limit.
 */
async function demoMessageTrimming() {
  console.log("\n==============================");
  console.log("5. Message Trimming / Cost Optimization Demo");
  console.log("==============================");

  const model = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0,
  });

  const messages: BaseMessage[] = [
    new SystemMessage("You are a helpful QA automation mentor."),
    new HumanMessage("Explain Playwright fixtures."),
    new HumanMessage("Explain storageState."),
    new HumanMessage("Explain API authentication."),
    new HumanMessage("Explain how to reuse login state."),
    new HumanMessage("Now summarize everything in 3 bullet points."),
  ];

  /**
   * This keeps the recent messages and drops older ones
   * when the token limit is crossed.
   *
   * Note:
   * tokenCounter can use the model itself if supported.
   */
  const trimmer = trimMessages({
    maxTokens: 100,
    strategy: "last",
    tokenCounter: model,
    includeSystem: true,
    allowPartial: false,
    startOn: "human",
  });

  const trimmedMessages = await trimmer.invoke(messages);

  console.log("Original message count:", messages.length);
  console.log("Trimmed message count:", trimmedMessages.length);

  const response = await model.invoke(trimmedMessages);

  console.log("\nResponse after trimming:");
  console.log(response.content);
}

/**
 * Main runner
 */
async function main() {
  await demoChatModel();
  await demoModelComparison();
  await demoMessages();
  await demoMultiTurnConversation();
  await demoMessageTrimming();
}

main().catch((error) => {
  console.error("Something went wrong:", error);
  process.exit(1);
});