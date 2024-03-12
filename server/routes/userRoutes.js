import {Router} from 'express';

import {signupUser, signInUser, microsoftAuth, searchUser, getProfile} from '../controllers/userController.js'

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signIn").post(signInUser);
router.route("/microsoftAuth").post(microsoftAuth);
router.route("/search-users").post(searchUser);
router.route("/get-profile").post(getProfile);


export default router;

