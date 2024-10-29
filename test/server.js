const http = require('http');
const bodyParser = require('body-parser');

const express = require('express');
const app = express();

// Настройка body-parser
app.use(bodyParser.json()); // Для обработки JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // Для обработки URL-кодированных данных

// Обработка POST-запроса
app.post('/signup', (req, res) => {
    const data = req.body; // Получение данных из тела запроса
    console.log('Received data:', data);

    // Отправка ответа клиенту
    res.status(200).json({
        message: 'Data received successfully!',
        receivedData: data,
    });
});

// Запуск сервера
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
