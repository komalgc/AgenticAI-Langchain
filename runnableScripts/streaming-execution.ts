import "dotenv/config";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

async function demoStreaming() {
  console.log("--- Demonstrating Streaming Execution ---");

  // 1. Create the prompt template
  // {topic} is the input variable we will pass later
  const prompt = ChatPromptTemplate.fromTemplate(
    "Write a short haiku about {topic}."
  );

  // 2. Create the model
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
  });

  // 3. Create the parser
  // This converts model chunks into plain text chunks
  const parser = new StringOutputParser();

  // 4. Create the chain
  // Flow: prompt -> model -> parser
  const chain = prompt.pipe(model).pipe(parser);

  // 5. Start streaming
  console.log("\nStreaming output:\n");

  const stream = await chain.stream({
    topic: "nature",
  });

  // 6. Print each chunk as soon as it arrives
  for await (const chunk of stream) {
    process.stdout.write(chunk);
  }

  console.log("\n\n--- Streaming completed ---");
}

// Execute the function
demoStreaming().catch((err) => {
  console.error("Error running streaming demo:", err);
});