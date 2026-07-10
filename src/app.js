import express from 'express'; 
import cors from "cors";
import pool from './config/db.js';

//Подключаем маршруты
import authRoutes from "./routes/authRoutes.js";
import authMiddleware from "./middleware/authMiddleware.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/notifications", notificationRoutes);

//Временная функция для проверки авторизации
/*app.get("/profile", authMiddleware, (req, res) => {

    res.json({
        message: "Доступ разрешён",
        user: req.user
    });

});*/

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Проверяем соединение с БД
        const connection = await pool.getConnection();
        console.log("Успешное подключение к базе данных MySQL!");
        connection.release(); // Освобождаем соединение

        app.listen(PORT, () => {
            console.log(`Server started on port ${PORT}`);
        });
    } catch (error) {
        console.error("Критическая ошибка при запуске сервера:");
        console.error(error); // Выводим ошибку целиком для детальной диагностики
        process.exit(1);
    }
}

startServer();

