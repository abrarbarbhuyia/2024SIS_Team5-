const { resolve } = require("path");
require("dotenv").config({ path: resolve(__dirname, ".env") });

const { OpenAI } = require("openai");

// Create OpenAI client
const openai = new OpenAI({ apiKey: process.env.GPT_KEY });

// calls GPT and responds in a JSON
async function callGPTJSON(prompt) {
  try {
    // Get the result from GPT
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Use the correct model name
      messages: [{ role: "user", content: prompt }],
    });

    // Extract the content from the response
    const content = response.choices[0].message.content;

    // Split the response into separate lines
    const lines = content.split('\n');

    // Remove the first and the last lines
    const trimmedResponse = lines.slice(1, -1).join('\n');

    // Print and return the trimmed response
    return trimmedResponse;
  } catch (error) {
    console.error("Error with GPT request:", error.message);
    throw error;
  }
}

module.exports = { callGPTJSON };