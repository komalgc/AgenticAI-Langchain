import "dotenv/config";
import { initChatModel } from "langchain/chat_models/universal";
import { ChatOpenAI } from "@langchain/openai";
// import { ChatAnthropic } from "@langchain/anthropic";



/**
 * Universal model initialization using initChatModel.
 *
 * This is useful because you can initialize models
 * from different providers using a common interface.
 */
async function demoNewUniversalWay() {
  console.log("\n========== NEW UNIVERSAL WAY ==========");

  const model = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0.7,
    maxTokens: 500,
  });

  const response = await model.invoke("Explain LangChain in one sentence.");

  console.log(response.content);
}



/**
 * Demo: model options
 *
 * Common configuration options include:
 * - model name
 * - provider
 * - temperature
 * - maxTokens
 * - timeout
 */
async function demoModelOptions() {
  console.log("\n========== MODEL OPTIONS ==========");

  const model = await initChatModel("gpt-4o-mini", {
    modelProvider: "openai",
    temperature: 0.3,
    maxTokens: 300,
    timeout: 30_000,
  });

  const response = await model.invoke(
    "Give me 3 reasons why QA engineers should learn LangChain."
  );

  console.log(response.content);
}

async function main() {
  await demoNewUniversalWay();
  await demoModelOptions();
}

main().catch(console.error);