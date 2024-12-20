const http = require('http');
const fs = require('fs');
const path = require('path');

// Имя файла для записи запросов
const logFilePath = path.join(__dirname, 'request.txt');

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
  const logData = `[${now}] ${req.method} ${req.url}\n`;

  // Логируем запрос
  logRequest(logData);

  // Ответ клиенту
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Ваш запрос сохранён в request.txt');
});

// Запуск сервера
const PORT = 3000; // Вы можете изменить порт
server.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
