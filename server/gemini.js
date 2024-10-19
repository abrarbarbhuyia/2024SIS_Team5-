const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// calls gemini and responds in a JSON
async function callGeminiJSON(prompt) {

    //Get result from Gemini and split into separate lines
    const result = await model.generateContent(prompt);
    const lines = result.response.text().split('\n');

    // Remove the first and the last lines
    const trimmedResponse = lines.slice(1, -1).join('\n'); 

    // return a json object
    // console.log(trimmedResponse);
    return trimmedResponse;
}

module.exports = { callGeminiJSON }