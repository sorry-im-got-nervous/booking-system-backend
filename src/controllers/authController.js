import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    findUserByEmail,
    createUser
} from "../models/userModel.js";

export const register = async (req, res) => {

    try {

        const { full_name, email, password } = req.body;

        // Проверка заполнения полей
        if (!full_name || !email || !password) {
            return res.status(400).json({
                message: "Все поля обязательны"
            });
        }

        // Проверяем, существует ли пользователь
        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Пользователь уже существует"
            });
        }

        // Хешируем пароль
        const passwordHash = await bcrypt.hash(password, 10);

        // Создаём пользователя
        const userId = await createUser(
            full_name,
            email,
            passwordHash
        );

        return res.status(201).json({
            message: "Пользователь успешно зарегистрирован",
            userId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};  

export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Введите email и пароль"
            });
        }

        // Ищем пользователя
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Неверный email или пароль"
            });
        }

        // Проверяем пароль
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Неверный email или пароль"
            });
        }

        // Создаём JWT
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        return res.json({
            message: "Вход выполнен успешно",
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};