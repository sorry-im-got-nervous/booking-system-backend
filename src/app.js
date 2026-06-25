const express = require('express');
const app = express();

// Мидлвары для работы с JSON
app.use(express.json());

// Базовый тестовый маршрут
app.get('/', (req, res) => {
    res.json({ message: "API работает отлично!" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});
