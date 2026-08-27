import {Router} from 'express';
import {getAllFriends,getFriend,deleteFriendship} from '../Controllers/friendshipControllers.mjs';
import jwtValidate from '../Middlewares/jwtValidate.mjs';

const router = Router();

router.get('/',jwtValidate,getAllFriends);

router.get('/:friendship_id',jwtValidate,getFriend);

router.delete('/:friendship_id',jwtValidate,deleteFriendship);

export default router;