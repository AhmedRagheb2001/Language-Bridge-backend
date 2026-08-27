import {Router} from 'express';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import {createChat,getAllChats,getSpecificChat,deleteChat} from '../Controllers/chatControllers.mjs';

const router = Router();

router.post('/:friend_id',jwtValidate,createChat);

router.get('/',jwtValidate,getAllChats);

router.get('/:chat_id',jwtValidate,getSpecificChat);

router.delete('/:chat_id',jwtValidate,deleteChat);

export default router;