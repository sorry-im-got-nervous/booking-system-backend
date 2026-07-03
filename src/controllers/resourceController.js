import {
    createResource,
    findResourceByName,
    getAllResources,
    getResourceById,
    updateResource,
} from "../models/resourceModel.js";

// Создание нового ресурса
export const addResource = async (req, res) => {

    try {

        // Получаем данные из тела запроса
        const {
            name,
            description,
            type
        } = req.body;

        // Проверяем обязательные поля
        if (!name || !type) {
            return res.status(400).json({
                message: "Название и тип обязательны"
            });
        }

        // Проверяем, существует ли уже ресурс с таким названием
        const existingResource = await findResourceByName(name);

        if (existingResource) {
            return res.status(409).json({
                message: "Ресурс с таким названием уже существует"
            });
        }
        
        // Создаём ресурс в базе данных
        // req.user.id — id пользователя, полученный из middleware авторизации
        const resourceId = await createResource(
            name,
            description,
            type,
            req.user.id
        );

        return res.status(201).json({
            message: "Ресурс успешно создан",
            resourceId
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

// Получение списка ресурсов
export const getResources = async (req, res) => {

    try {
        const resources = await getAllResources();

        return res.json(resources);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

// Получение ресурса по id
export const getResource = async (req, res) => {

    try {
        // Получаем id из параметров маршрута
        const resource = await getResourceById(req.params.id);

        if (!resource) {
            return res.status(404).json({
                message: "Ресурс не найден"
            });
        }

        return res.json(resource);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};

//Редактирование ресурса
export const editResource = async (req, res) => {

    try {
        // Получаем обновляемые поля из тела запроса
        const { name, description, type, status } = req.body;

        const updated = await updateResource(
            req.params.id,
            name,
            description,
            type,
            status
        );

        if (!updated) {
            return res.status(404).json({
                message: "Ресурс не найден"
            });
        }

        return res.json({
            message: "Ресурс обновлён"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};