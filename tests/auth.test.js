import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

import { deleteUserByEmail } from "../src/models/userModel.js";
const randomEmail = `test_${Date.now()}@mail.com`;

describe("Authentication API", () => {

    

    test("Регистрация нового пользователя", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                full_name: "Test User",
                email: randomEmail,
                password: "123456"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toBe("Пользователь успешно зарегистрирован");
    });

    test("Повторная регистрация возвращает ошибку", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                full_name: "Test User",
                email: randomEmail,
                password: "123456"
            });

        expect(response.statusCode).toBe(409);
    });

    test("Успешный вход", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: randomEmail,
                password: "123456"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    });

    test("Неверный пароль", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email: randomEmail,
                password: "wrongpassword"
            });

        expect(response.statusCode).toBe(401);
    });

});

afterAll(async () => {
    await deleteUserByEmail(randomEmail);
    await pool.end();
});