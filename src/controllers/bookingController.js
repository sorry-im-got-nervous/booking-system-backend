import { getResourceById } from "../models/resourceModel.js";

import {
    findBookingConflict,
    createBooking,
    getAllBookings,
    getMyBookings,
    getBookingById,
    cancelBooking
} from "../models/bookingModel.js";

export const addBooking = async (req, res) => {

    try {

        const {
            resource_id,
            start_time,
            end_time,
            purpose
        } = req.body;

        // Проверка обязательных полей
        if (!resource_id || !start_time || !end_time) {
            return res.status(400).json({
                message: "Необходимо заполнить все обязательные поля"
            });
        }

        // Проверка времени
        if (new Date(start_time) >= new Date(end_time)) {
            return res.status(400).json({
                message: "Время окончания должно быть позже времени начала"
            });
        }

        if (new Date(start_time) < new Date()) {
            return res.status(400).json({
                message: "Нельзя создать бронирование на прошедшее время"
            });
        }

        // Проверяем существование ресурса
        const resource = await getResourceById(resource_id);

        if (!resource) {
            return res.status(404).json({
                message: "Ресурс не найден"
            });
        }

        //Проверяем доступность ресурса
        if (resource.status !== "active") {
            return res.status(400).json({
                message: "Ресурс недоступен для бронирования"
            });
        }

        // Проверяем пересечение
        const conflicts = await findBookingConflict(
            resource_id,
            start_time,
            end_time
        );

        //Проверка минимального времени бронирования
        const duration = new Date(end_time) - new Date(start_time);

        if (duration < 15 * 60 * 1000) {
            return res.status(400).json({
                message: "Минимальная продолжительность бронирования — 15 минут"
            });
        }

        if (conflicts.length > 0) {
            return res.status(409).json({
                message: "Ресурс уже забронирован на выбранное время"
            });
        }

        // Создаем бронирование
        const bookingId = await createBooking(
            resource_id,
            req.user.id,
            start_time,
            end_time,
            purpose
        );

        return res.status(201).json({
            message: "Бронирование успешно создано",
            bookingId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

//Получить все бронирования
export const getBookings = async (req, res) => {

    try {

        const bookings = await getAllBookings();

        return res.json(bookings);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

//Получить бронирования конкретного пользователя
export const getMyBookingsList = async (req, res) => {

    try {

        const bookings = await getMyBookings(req.user.id);

        return res.json(bookings);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

//Отмена бронирования
export const cancelUserBooking = async (req, res) => {

    try {

        const booking = await getBookingById(req.params.id);
        
        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Бронирование уже отменено"
            });
        }

        if (!booking) {
            return res.status(404).json({
                message: "Бронирование не найдено"
            });
        }

        if (
            booking.user_id !== req.user.id &&
            req.user.role !== "admin"
        ) {
            return res.status(403).json({
                message: "Недостаточно прав"
            });
        }

        await cancelBooking(req.params.id);

        return res.json({
            message: "Бронирование отменено"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};
