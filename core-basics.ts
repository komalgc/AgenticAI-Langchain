import "dotenv/config"; // Automatically loads .env variables
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function demoBasicChain() {
  console.log("--- Demonstrating Basic LCEL Chain ---");

  // Step 1: Create a reusable prompt
  const prompt = ChatPromptTemplate.fromTemplate(
    "You are a helpful assistant. Answer in one sentence. Question: {question}"
  );

  // Step 2: Connect to OpenAI model
  const model = new ChatOpenAI({
    model: "gpt-4o-mini", // OpenAI model used for this call
    temperature: 0.7,
  });

   // Step 3: Convert model response into plain text
  const parser = new StringOutputParser();

    // Step 4: Create the chain: prompt -> model -> parser
  const chain = prompt.pipe(model).pipe(parser);

  // Step 5: This is where OpenAI API is called
  // Execute the chain as a Runnable using .invoke()
  const result = await chain.invoke({
    question: "What is LangChain?",
  });

  console.log("Response:", result);
  
  return chain;
}

// Execute the function
demoBasicChain().catch((err) => {
  console.error("Error running the chain:", err);
});