import express from 'express';
import authRoutes from './Routes/authRoutes.mjs';
import userRoutes from './Routes/userRoutes.mjs';
import postRoutes from './Routes/postRoutes.mjs';
import cors from 'cors';
import helmet from 'helmet';
import errorHandler from './Middlewares/errorHandler.mjs';
import commentRoutes from './Routes/commentRoutes.mjs';
import likeRoutes from './Routes/likeRoutes.mjs';
import friendRequestRoutes from './Routes/friendRequestRoutes.mjs';
import notificationRoutes from './Routes/notificationRoutes.mjs';
import friendshipRoutes from './Routes/friendshipRoutes.mjs';
import chatRoutes from './Routes/chatRoutes.mjs';
import messageRoutes from './Routes/messageRoutes.mjs';
import profileRoutes from './Routes/profileRoutes.mjs';
import apiLimiter from "./Middlewares/apiLimiter.mjs";

const app = express();


//Adding the Public Middlewares
app.use(express.json());
app.use(express.urlencoded());
//We need to change this after the Mobile Developer finish the app
app.use(cors({
    origin : "*"
}));
app.use(helmet());
// app.use(apiLimiter);

//Registering the routes
app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1',postRoutes);
app.use('/api/v1/posts/:post_id/comments',commentRoutes);
app.use('/api/v1/posts/:post_id/likes',likeRoutes);
app.use('/api/v1',friendRequestRoutes);
app.use('/api/v1',notificationRoutes);
app.use('/api/v1/friends',friendshipRoutes);
app.use('/api/v1/chats',chatRoutes);
app.use('/api/v1/chats/:chat_id/messages',messageRoutes);
app.use('/api/v1',profileRoutes);
//Default Route
app.get('/',(req,res)=>{
    res.status(200).json({message:"Welcome to my Server"});
})

//ErrorHandler Middleware 
app.use(errorHandler);
export default app; 