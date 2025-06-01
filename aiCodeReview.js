const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aiCodeReview = async (code) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are a helpful coding assistant. Analyze the following JavaScript code and do the following:
        1. Identify and fix any syntax or logic errors.
        2. Suggest improvements to make the code cleaner, more efficient, or easier to understand.
        3. Provide the time and space complexity of the original version.
        4. If an optimized approach is possible, provide the optimized code.
        5. Then, explain the time and space complexity of the optimized version.
        Here is the code:
        ${code} `
    });

    console.log(response.text);
    return response.text;
};

module.exports = {
    aiCodeReview,
};
