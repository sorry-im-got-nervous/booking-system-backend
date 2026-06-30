import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    // Получаем заголовок Authorization
    const authHeader = req.headers.authorization;

    // Проверяем, что заголовок существует
    if (!authHeader) {
        return res.status(401).json({
            message: "Требуется авторизация"
        });
    }

    // Формат должен быть: Bearer <token>
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Токен отсутствует"
        });
    }

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Сохраняем данные пользователя
        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            message: "Недействительный токен"
        });

    }

};

export default authMiddleware;