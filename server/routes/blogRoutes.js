import {Router} from "express";

import { upLoadImages, createBlog} from "../controllers/blogController.js";
import photoMiddleware from "../middlewares/photoMiddleware.js";
import verifyToken from "../middlewares/verifyToken.js";


const router = Router();

router.route("/upload").post(photoMiddleware.array("photos", 100), upLoadImages );
router.route("/create-blog").post(verifyToken,createBlog);


export default router;