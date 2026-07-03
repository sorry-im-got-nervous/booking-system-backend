import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";
import {
    addResource,
    getResources,
    getResource,
    editResource
} from "../controllers/resourceController.js";

const router = express.Router();

// Создание нового ресурса
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    addResource
);

//Получение всех ресурсов
router.get("/", authMiddleware, getResources);
//Получение одного ресурса по id
router.get("/:id", authMiddleware, getResource);

//Изменение ресурса
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    editResource
);

export default router;