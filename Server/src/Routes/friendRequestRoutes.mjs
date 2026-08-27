import {Router} from 'express';
import {createFriendRequest,getAllSentFriendRequests,getAllReceivedFriendRequests,
    acceptFriendRequest,rejectFriendRequest,cancelFriendRequest,deleteFriendRequest
} from '../Controllers/friendRequestControllers.mjs';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
const router = Router();

router.post('/friend-requests/:receiver_id',jwtValidate,createFriendRequest);

router.get('/friend-requests/sent',jwtValidate,getAllSentFriendRequests);

router.get('/friend-requests/received',jwtValidate,getAllReceivedFriendRequests);

router.patch('/friend-requests/:friendRequest_id/accept',jwtValidate,acceptFriendRequest);

router.patch('/friend-requests/:friendRequest_id/reject',jwtValidate,rejectFriendRequest);

router.patch('/friend-requests/:friendRequest_id/cancel',jwtValidate,cancelFriendRequest);

router.delete('/friend-requests/:friendRequest_id',jwtValidate,deleteFriendRequest);

export default router;