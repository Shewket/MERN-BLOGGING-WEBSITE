import {Router} from "express";
import {addComment, getComments, getReplies, deleteComment} from "../controllers/commentController.js"
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.route("/add-comment").post(verifyToken,addComment);
router.route("/get-comments").post(getComments);
router.route("/get-replies").post(getReplies);
router.route("/delete-comment").post(verifyToken, deleteComment)

export default router;