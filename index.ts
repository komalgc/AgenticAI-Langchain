import "dotenv/config"; // Automatically loads .env file
import { ChatOpenAI } from "@langchain/openai";


async function main() {
  console.log("Initializing models...");

  // 1. Verify OpenAI Setup
  const openaiModel = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
  });

  console.log("Testing OpenAI inference...");
  const openaiResponse = await openaiModel.invoke("Say 'setup complete' in one word.");
  console.log("OpenAI Response:", openaiResponse.content);

  console.log("---");

  /* // 2. Verify Anthropic Setup
  const anthropicModel = new ChatAnthropic({
    model: "claude-3-5-sonnet-20241022",
    temperature: 0,
  });

  console.log("Testing Anthropic inference...");
  const anthropicResponse = await anthropicModel.invoke("Say 'setup complete' in one word.");
  console.log("Anthropic Response:", anthropicResponse.content);

  console.log("\nAll setups verified successfully!");
  */
} // <--- The closing bracket needs to be out here!

main().catch((err) => {
  console.error("Verification failed:", err);
});