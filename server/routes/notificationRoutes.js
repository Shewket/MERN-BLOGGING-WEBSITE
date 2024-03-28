import {Router} from "express";
import verifyToken from "../middlewares/verifyToken.js";
import {newNotification, getNotifications, getAllNotificationsCount} from "../controllers/notificationController.js";

const router = Router();

router.route("/new-notification").get(verifyToken, newNotification);
router.route("/notifications").post(verifyToken, getNotifications);
router.route("/all-notifications-count").post(verifyToken, getAllNotificationsCount)


export default router;