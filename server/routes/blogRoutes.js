import {Router} from "express";

import { upLoadImages, createBlog, getLatestBlogs, getTrendingBlogs, getSearchingBlogs, getCountOfAllLatestBlogs,getCountOfSearchingBlogs, ocr} from "../controllers/blogController.js";
import photoMiddleware from "../middlewares/photoMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = Router();

router.route("/upload").post(photoMiddleware.array("photos", 100), upLoadImages );
router.route("/create-blog").post(verifyToken,createBlog);
router.route('/latest-blogs').post(getLatestBlogs);
router.route("/trending-blogs").get(getTrendingBlogs);
router.route("/search-blogs").post(getSearchingBlogs);
router.route("/all-latest-blogs-count").post(getCountOfAllLatestBlogs);
router.route("/search-blogs-count").post(getCountOfSearchingBlogs);
router.route("/ocr").post(ocr)


export default router; 