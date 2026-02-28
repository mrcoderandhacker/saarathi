const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function test() {
    try {
        console.log("Using key:", process.env.GEMINI_API_KEY.substring(0, 10) + '...');
        const result = await model.generateContent("Hello!");
        console.log(result.response.text());
    } catch (e) {
        console.error("FULL ERROR:");
        console.error(e);
    }
}
test();
