require('dotenv').config(); // Подключаем dotenv
const http = require('http');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Имя файла для записи запросов
const logFilePath = path.join(__dirname, 'request.txt');

// Чтение переменных окружения
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
const PORT = process.env.PORT || 3000; // Порт из .env или 3000 по умолчанию

// Функция для отправки логов в Telegram
async function sendLogToTelegram(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  try {
    await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
    });
  } catch (error) {
    console.error('Ошибка отправки сообщения в Telegram:', error.message);
  }
}

// Функция для записи данных в файл
function logRequest(data) {
  fs.appendFile(logFilePath, data, (err) => {
    if (err) {
      console.error('Ошибка записи в файл:', err);
    }
  });
}

// Создание HTTP-сервера
const server = http.createServer((req, res) => {
  const now = new Date().toISOString(); // Текущее время
  const clientIp = req.socket.remoteAddress; // IP-адрес клиента
  const headers = JSON.stringify(req.headers, null, 2); // Заголовки запроса

  let logData = `[${now}] ${req.method} ${req.url}\n`;
  logData += `IP: ${clientIp}\n`;
  logData += `Headers: ${headers}\n`;

  if (req.method === 'POST') {
    // Чтение данных из тела запроса
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      logData += `Body: ${body}\n`;
      logData += `---\n`;

      // Логируем запрос в файл
      logRequest(logData);

      // Отправляем лог в Telegram
      sendLogToTelegram(logData);

      // Ответ клиенту
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Your POST request has been logged and sent to Telegram!');
    });
  } else {
    logData += `---\n`;

    // Логируем запрос в файл
    logRequest(logData);

    // Отправляем лог в Telegram
    sendLogToTelegram(logData);

    // Ответ клиенту
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Your request has been logged and sent to Telegram!');
  }
});

// Запуск сервера
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
