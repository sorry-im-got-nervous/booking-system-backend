import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

import {
    addBooking,
    getBookings,
    getMyBookingsList,
    cancelUserBooking
} from "../controllers/bookingController.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    addBooking
);

router.get(
    "/my",
    authMiddleware,
    getMyBookingsList
);

router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    getBookings
);

router.patch(
    "/:id/cancel",
    authMiddleware,
    cancelUserBooking
);

export default router;

