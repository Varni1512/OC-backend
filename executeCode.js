const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const outputPath = path.join(__dirname, "outputs");
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

const isWindows = process.platform === "win32";

const executeCode = (filePath, inputFilePath, language) => {
  const jobId = path.basename(filePath).split(".")[0];

  return new Promise((resolve, reject) => {
    let command;

    // Always quote paths
    const quotedFilePath = `"${filePath}"`;
    const quotedInputPath = `"${inputFilePath}"`;

    if (language === "cpp" || language === "c") {
      const compiler = language === "cpp" ? "g++" : "gcc";
      const outputFile = `${jobId}${isWindows ? ".exe" : ""}`;
      const outPath = path.join(outputPath, outputFile);
      const quotedOutPath = `"${outPath}"`;
      const runCmd = isWindows
        ? `.\\"${outputFile}" < ${quotedInputPath}`
        : `./${outputFile} < ${quotedInputPath}`;

      // compile source to outputPath, then cd and run executable
      command = `${compiler} ${quotedFilePath} -o ${quotedOutPath} && cd "${outputPath}" && ${runCmd}`;

    } else if (language === "java") {
      const className = "Main"; // adjust if your class name is different
      const dir = path.dirname(filePath);
      const quotedDir = `"${dir}"`;

      // cd to source dir, compile, then run
      command = `cd ${quotedDir} && javac ${quotedFilePath} && java ${className} < ${quotedInputPath}`;

    } else if (language === "py") {
      // Use python3 if available, fallback to python
      command = `python3 ${quotedFilePath} < ${quotedInputPath} || python ${quotedFilePath} < ${quotedInputPath}`;

    } else {
      return reject({ error: "Unsupported language" });
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject({ error: error.message });
      }
      if (stderr) {
        // Warning: some programs print to stderr but it's not fatal
        console.warn("Stderr:", stderr);
      }
      resolve(stdout);
    });
  });
};

module.exports = { executeCode };
