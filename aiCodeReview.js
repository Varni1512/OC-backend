const { GoogleGenAI } = require("@google/genai");
const dotenv = require("dotenv");

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const aiCodeReview = async (code) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `You are an expert code optimizer.
Your task:
1. Provide an optimized version of the following code.
2. After the optimized code, output exactly TWO lines:
Time Complexity: <big-O>
Space Complexity: <big-O>

Return **nothing** else—no explanations, no bullet points.

Here is the code:
${code}`,
    });

    console.log(response.text);
    return response.text;
};

// New function for complexity analysis only
const getComplexityAnalysis = async (code) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Analyze the following code and provide ONLY the time and space complexity in this exact format:

Time Complexity: [your answer]
Space Complexity: [your answer]

Do not provide any explanations, examples, or additional text. Only the complexity analysis in the format above.

Here is the code:
        ${code}`
    });

    console.log(response.text);
    return response.text;
};

module.exports = {
    aiCodeReview,
    getComplexityAnalysis,
};
