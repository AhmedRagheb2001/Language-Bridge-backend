import {Router} from 'express';
import {registerNewUser,loginUser,getCurrentUser,logoutUser,refreshTheToken} from '../Controllers/authControllers.mjs';
import {inputValidationRegister} from '../Middlewares/inputValidation.mjs';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import loginLimiter from "../Middlewares/loginLimiter.mjs";

const router = Router();

router.post('/register',registerNewUser );

router.post('/login',loginUser);

router.get('/me',jwtValidate,getCurrentUser);

router.post('/logout',jwtValidate,logoutUser);

router.post('/refresh-token',refreshTheToken);

export default router;

