import request from "supertest";
import app from "../src/app.js";

import pool from "../src/config/db.js";

let userToken;
let adminToken;

let resourceId;
let bookingId;


const testUser = {
    full_name: "Booking Test User",
    email: `booking_${Date.now()}@mail.ru`,
    password: "123456"
};


describe("Booking API", () => {


    beforeAll(async () => {

        // Регистрация пользователя
        await request(app)
            .post("/api/auth/register")
            .send(testUser);


        // Логин пользователя
        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email: testUser.email,
                password: testUser.password
            });


        userToken = login.body.token;



        // Получаем существующий ресурс
        const resources = await request(app)
            .get("/api/resources")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            );


        resourceId = resources.body[0].id;

    });



    test("Создание бронирования", async () => {


        const response = await request(app)
            .post("/api/bookings")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({

                resource_id: resourceId,

                start_time:
                    "2027-01-10 10:00:00",

                end_time:
                    "2027-01-10 12:00:00",

                purpose:
                    "Тестовое бронирование"

            });


        expect(response.statusCode)
            .toBe(201);


        expect(response.body)
            .toHaveProperty("bookingId");


        bookingId = response.body.bookingId;

    });



    test("Нельзя создать пересекающееся бронирование", async () => {


        const response = await request(app)
            .post("/api/bookings")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            )
            .send({

                resource_id: resourceId,

                start_time:
                    "2027-01-10 11:00:00",

                end_time:
                    "2027-01-10 13:00:00",

                purpose:
                    "Конфликт"

            });



        expect(response.statusCode)
            .toBe(409);

    });



    test("Получение своих бронирований", async () => {


        const response = await request(app)
            .get("/api/bookings/my")
            .set(
                "Authorization",
                `Bearer ${userToken}`
            );


        expect(response.statusCode)
            .toBe(200);


        expect(Array.isArray(response.body))
            .toBe(true);

    });



    test("Отмена своего бронирования", async () => {


        const response = await request(app)
            .patch(`/api/bookings/${bookingId}/cancel`)
            .set(
                "Authorization",
                `Bearer ${userToken}`
            );


        expect(response.statusCode)
            .toBe(200);


        expect(response.body.message)
            .toBe(
                "Бронирование отменено"
            );

    });



    test("Удаление тестовых данных", async () => {


        await pool.query(
            `
            DELETE FROM bookings
            WHERE purpose = ?
            `,
            [
                "Тестовое бронирование"
            ]
        );


        await pool.query(
            `
            DELETE FROM users
            WHERE email = ?
            `,
            [
                testUser.email
            ]
        );


    });


});

afterAll(async () => {
    await pool.end();
});
