import {
    createResource,
    findResourceByName,
    getAllResources,
    getResourceById,
    updateResource,
    deleteResource
} from "../models/resourceModel.js";

export const addResource = async (req, res) => {

    try {

        const {
            name,
            description,
            type
        } = req.body;

        if (!name || !type) {
            return res.status(400).json({
                message: "Название и тип обязательны"
            });
        }

        const existingResource = await findResourceByName(name);

        if (existingResource) {
            return res.status(409).json({
                message: "Ресурс с таким названием уже существует"
            });
        }
        
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

export const getResource = async (req, res) => {

    try {

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

export const editResource = async (req, res) => {

    try {

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

export const removeResource = async (req, res) => {

    try {

        const deleted = await deleteResource(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                message: "Ресурс не найден"
            });
        }

        return res.json({
            message: "Ресурс удалён"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            message: "Ошибка сервера"
        });

    }

};