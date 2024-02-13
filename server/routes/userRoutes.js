import {Router} from 'express';

import {signupUser, signInUser} from '../controllers/userController.js'

const router = Router();

router.route("/signup").post(signupUser);
router.route("/signIn").post(signInUser);


export default router;

