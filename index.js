const express = require("express");
const { generateFile } = require("./generateFile");
const { executeCode } = require("./executeCode");
const { generateInputFile } = require("./generateInputFile");
const cors = require("cors");
const { aiCodeReview, getComplexityAnalysis } = require("./aiCodeReview");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Online Compiler" });
});

app.post("/run", async (req, res) => {
  const { language = "cpp", code, input = "" } = req.body;

  if (!code) {
    return res.status(400).json({ success: false, error: "Code is required." });
  }

  try {
    const filepath = generateFile(language, code);
    const inputFilePath = generateInputFile(input);
    const output = await executeCode(filepath, inputFilePath, language);
    
    // Get complexity analysis
    const complexity = await getComplexityAnalysis(code);
    
    res.json({ 
      filepath, 
      output, 
      complexity 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.error || "Execution failed" });
  }
});

app.post("/ai-review", async (req,res) => {
  const {code} = req.body;
  if(code === undefined || code.trim() === ''){
    return res.status(400).json({
      success: false,
      error: "Empty code! please provide some code to execute"
    });
  }
  try{
    const review = await aiCodeReview(code);
    res.status(200).json({"review":review});
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || error.toString() || 'An error occurred while executing the code'
    });
  }
});

module.exports = app;
