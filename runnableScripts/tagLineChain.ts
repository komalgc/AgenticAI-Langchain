import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

async function demoTaglineChain() {
  /**
   * Exercise:
   * 1. Takes a product name and target audience
   * 2. Generates a marketing tagline
   * 3. Returns just the tagline as a string
   */

  // 1. Create the prompt template
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a marketing copywriter.

Create one short, catchy marketing tagline for this product.

Product: {product}
Target audience: {audience}

Return only the tagline.
`);

  // 2. Create the model
  const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0.7,
  });

  // 3. Create the output parser
  // This makes sure the final response is returned as a plain string.
  const parser = new StringOutputParser();

  // 4. Create the chain
  const chain = prompt.pipe(model).pipe(parser);

  // 5. Invoke the chain with product and audience
  const result = await chain.invoke({
    product: "AI Course",
    audience: "developers",
  });

  // 6. Print the final tagline
  console.log("Generated Tagline:");
  console.log(result);
}

demoTaglineChain().catch(console.error);