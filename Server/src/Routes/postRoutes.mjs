import {Router} from 'express';
import {getAllPosts,getSpecificPost,createNewPost,getUserPosts,updatePost
    ,deletePost,uploadPostPicture,deletePostPicture
} from '../Controllers/postControllers.mjs';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import upload from "../Middlewares/upload.mjs";

const router = Router();

router.get('/posts/',jwtValidate,getAllPosts);

router.get('/posts/:post_id',jwtValidate,getSpecificPost);

router.post('/posts/',jwtValidate,upload.single("postPicture"),createNewPost);

router.patch('/posts/:post_id',jwtValidate,updatePost);

router.delete('/posts/:post_id',jwtValidate,deletePost);

router.get('/users/:user_id/posts',jwtValidate,getUserPosts);

router.delete('/posts/:post_id/postPicture',jwtValidate,deletePostPicture);

router.patch('/posts/:post_id/postPicture',jwtValidate,upload.single("postPicture"),uploadPostPicture);
export default router;