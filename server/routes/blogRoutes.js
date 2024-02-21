import {Router} from "express";

import { upLoadImages } from "../controllers/blogController.js";
import photoMiddleware from "../middlewares/photoMiddleware.js";


const router = Router();




router.route("/upload").post(photoMiddleware.array("photos", 100), upLoadImages );

export default router;