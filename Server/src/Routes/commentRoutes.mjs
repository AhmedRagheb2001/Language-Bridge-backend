import {Router} from 'express';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import {getAllComments,createNewComment,updateComment,deleteComment,getSpecificComment} from '../Controllers/commentControllers.mjs'

const router = Router({ mergeParams: true });

router.get('/',jwtValidate,getAllComments);

router.post('/',jwtValidate,createNewComment);

router.patch('/:comment_id',jwtValidate,updateComment);

router.delete('/:comment_id',jwtValidate,deleteComment);

router.get('/:comment_id',jwtValidate,getSpecificComment);

export default router;