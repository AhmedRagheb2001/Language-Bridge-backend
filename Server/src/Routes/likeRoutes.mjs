import {Router} from 'express';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import {likesPost,dislikesPost} from '../Controllers/likeControllers.mjs';

const router = Router({ mergeParams: true });

router.post('/',jwtValidate,likesPost);

router.delete('/',jwtValidate,dislikesPost);

export default router;