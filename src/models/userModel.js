import pool from "../config/db.js";

// Поиск пользователя по email
export const findUserByEmail = async (email) => {
    const [rows] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

// Создание нового пользователя
export const createUser = async (fullName, email, passwordHash) => {

    // Вставляем нового пользователя в базу
    // Пароль сохраняется в виде хеша
    const [result] = await pool.query(
        `INSERT INTO users (full_name, email, password_hash)
         VALUES (?, ?, ?)`,
        [fullName, email, passwordHash]
    );

    // Возвращаем id созданного пользователя
    return result.insertId;
};