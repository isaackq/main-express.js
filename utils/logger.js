// utils/logger.js
const fs = require("fs");
const path = require("path");

const logPath = path.join(__dirname, "../logs/action.log");

function saveLog(message) {
  const time = new Date().toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  const logLine = `[${time}] ${message}\n`;

  // Ensure logs folder exists
  const folderPath = path.dirname(logPath);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
  
  // Write or append the log
  fs.appendFile(logPath, logLine, (err) => {
    if (err) console.error("❌ Error writing log:", err.message);
  });
}

module.exports = { saveLog };
