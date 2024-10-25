const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function callGeminiJSON(prompt, retries = 8, delay = 1000) {
  try {
    // Get result from Gemini and split into separate lines
    const result = await model.generateContent(prompt);
    const lines = result.response.text().split('\n');

    // Remove the first and the last lines
    const trimmedResponse = lines.slice(1, -1).join('\n');

    // return a JSON object
    return trimmedResponse;

  } catch (error) {
    if (error.message.includes("429 Too Many Requests")) {
      console.error("Quota exceeded, too many requests. Skipping Gemini API call.");
      if (retries > 0) {
        console.log(`Retrying Gemini call..`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return callGeminiJSON(prompt, retries - 1, delay * 2); 
      } else {
        console.log("Max retries reached. Skipping Gemini API call.");
        return null; 
      }
    } else {
      console.error(`Error calling Gemini API: ${error.message}`);
      return null;
    }
  }
}

module.exports = { callGeminiJSON };