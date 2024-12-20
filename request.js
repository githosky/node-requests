require('dotenv').config(); // Load dotenv
const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Name of the file to log requests
const logFilePath = path.join(__dirname, 'request.txt');

// Read environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 3000; // Use the port from .env or 3000 by default

// Function to send logs to Telegram
async function sendLogToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Error sending message to Telegram:', error.message);
  }
}

// Function to log request data to a file
function logRequest(data) {
  fs.appendFile(logFilePath, data, (err) => {
    if (err) {
      console.error('Error writing to file:', err);
    }
  });
}

// Create HTTP server
const server = http.createServer((req, res) => {
  const now = new Date().toISOString(); // Current time
  const logData = `[${now}] ${req.method} ${req.url}\n`;

  // Log request to file
  logRequest(logData);

  // Send log to Telegram
  sendLogToTelegram(logData);

  // Respond to the client
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Your request has been logged and sent to Telegram!');
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
