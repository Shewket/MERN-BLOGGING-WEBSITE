import {Router} from "express";

import { upLoadImages, createBlog, getLatestBlogs, ocr} from "../controllers/blogController.js";
import photoMiddleware from "../middlewares/photoMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = Router();

router.route("/upload").post(photoMiddleware.array("photos", 100), upLoadImages );
router.route('/latest-blogs').get(getLatestBlogs);
router.route("/create-blog").post(verifyToken,createBlog);
router.route("/ocr").post(ocr)


export default router; 