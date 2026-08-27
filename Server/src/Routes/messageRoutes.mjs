import {Router} from 'express';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import {createMessage,getAllMessages,updateMessage,deleteMessage} from '../Controllers/messageControllers.mjs';
const router = Router({ mergeParams: true });

router.post('/',jwtValidate,createMessage);

router.get('/',jwtValidate,getAllMessages);

router.patch('/:message_id',jwtValidate,updateMessage);

router.delete('/:message_id',jwtValidate,deleteMessage);

export default router;