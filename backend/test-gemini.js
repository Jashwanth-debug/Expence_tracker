const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function test() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error);
  }
}

test();
