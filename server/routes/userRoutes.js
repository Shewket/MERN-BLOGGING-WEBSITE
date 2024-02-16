import {Router} from 'express';

import {signupUser, signInUser, microsoftAuth} from '../controllers/userController.js'

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signIn").post(signInUser);
router.route("/microsoftAuth").post(microsoftAuth);


export default router;

