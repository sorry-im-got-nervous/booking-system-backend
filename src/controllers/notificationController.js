import {
    getUserNotifications,
    markNotificationAsRead
} from "../models/notificationModel.js";

// Получить мои уведомления
export const getNotifications = async (req, res) => {

    try {

        const notifications = await getUserNotifications(req.user.id);

        return res.json(notifications);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

// Отметить уведомление прочитанным
export const readNotification = async (req, res) => {

    try {

        const updated = await markNotificationAsRead(
            req.params.id,
            req.user.id
        );

        if (updated === 0) {
            return res.status(404).json({
                message: "Уведомление не найдено"
            });
        }

        return res.json({
            message: "Уведомление отмечено как прочитанное"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};