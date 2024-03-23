import {Router} from 'express';

import {signupUser, signInUser, microsoftAuth, searchUser, getProfile, changePassword} from '../controllers/userController.js'
import verifyToken from "../middlewares/verifyToken.js";

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signIn").post(signInUser);
router.route("/microsoftAuth").post(microsoftAuth);
router.route("/search-users").post(searchUser);
router.route("/get-profile").post(getProfile);
router.route("/change-password").post(verifyToken, changePassword)


export default router;

