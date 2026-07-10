import request from "supertest";
import app from "../src/app.js";
import pool from "../src/config/db.js";

import jwt from "jsonwebtoken";

describe("Resources API", () => {

    let adminToken;
    let userToken;
    let createdResourceId;

    const testResourceName = `TEST_resource_${Date.now()}`;

    beforeAll(() => {

        adminToken = jwt.sign(
            {
                id: 1,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );


        userToken = jwt.sign(
            {
                id: 2,
                role: "user"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

    });


    test("Получение списка ресурсов", async () => {

        const response = await request(app)
            .get("/api/resources")
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );


        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);

    });


    test("Администратор может создать ресурс", async () => {

        const response = await request(app)
            .post("/api/resources")
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            )
            .send({
                name: testResourceName,
                description: "Тестовый ресурс",
                type: "equipment"
            });


        expect(response.statusCode).toBe(201);

        expect(response.body.resourceId)
            .toBeDefined();


        createdResourceId = response.body.resourceId;

    });


    test("Обычный пользователь не может создать ресурс", async () => {

        const response = await request(app)
            .post("/api/resources")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({
                name: "Forbidden Resource",
                description: "Ошибка прав",
                type: "equipment"
            });


        expect(response.statusCode).toBe(403);

    });


    test("Получение несуществующего ресурса возвращает 404", async () => {

        const response = await request(app)
            .get("/api/resources/999999")
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );


        expect(response.statusCode).toBe(404);

    });

    afterAll(async () => {

        await pool.query(
            "DELETE FROM resources WHERE name = ?",
            [testResourceName]
        );

        await pool.end();

    });
});