import {Router} from 'express';
import {getAllUsers,getSpecificUser,updateUser,deleteUser} from '../Controllers/userControllers.mjs';
import jwtValidate from '../Middlewares/jwtValidate.mjs';

const router = Router();

router.get('/',jwtValidate,getAllUsers);

router.get('/:user_id',jwtValidate,getSpecificUser);

router.patch('/:user_id',jwtValidate,updateUser);

router.delete('/:user_id',jwtValidate,deleteUser);

export default router;