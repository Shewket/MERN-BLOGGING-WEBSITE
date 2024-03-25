import {Router} from 'express';

import {signupUser, signInUser, microsoftAuth, searchUser, getProfile, changePassword, updatePorfileImg, updateProfile} from '../controllers/userController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signIn").post(signInUser);
router.route("/microsoftAuth").post(microsoftAuth);
router.route("/search-users").post(searchUser);
router.route("/get-profile").post(getProfile);
router.route("/change-password").post(verifyToken, changePassword);
router.route("/update-profile-img").post(verifyToken, updatePorfileImg);
router.route("/update-profile").post(verifyToken, updateProfile);


export default router;

