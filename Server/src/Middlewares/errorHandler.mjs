import {STATUS_CODE} from '../constants.mjs';

const errorHandler = (err,req,res,next) =>{

    const statusCode = res.statusCode === 200 ? STATUS_CODE.SERVER_ERROR : res.statusCode;

    switch(statusCode)
    {
        case STATUS_CODE.BAD_REQUEST : 
            res.status(STATUS_CODE.BAD_REQUEST).json({
                title : "Bad Request",
                errorMessage : err.message,
                stackTrace : err.stack
            });
            break;
        case STATUS_CODE.UNAUTHORIZED :
            res.status(STATUS_CODE.UNAUTHORIZED).json({
                title : "Un Authenticated",
                errorMessage :err.message,
                stackTrace : err.stack
            });
            break;
        case STATUS_CODE.FORBIDDEN : 
            res.status(STATUS_CODE.FORBIDDEN).json({
                title : "Forbidden",
                errorMessage :err.message,
                stackTrace : err.stack
            });
            break;
        case STATUS_CODE. NOT_FOUND :
            res.status(STATUS_CODE. NOT_FOUND).json({
                title : "Not Found",
                errorMessage :err.message,
                stackTrace : err.stack
            });
            break;
        case STATUS_CODE.CONFLICT :
            res.status(STATUS_CODE.CONFLICT).json({
                title : "Conflict",
                errorMessage :err.message,
                stackTrace : err.stack
            });
            break;
        default : 
            res.status(STATUS_CODE.SERVER_ERROR).json({
                title : "Server Error",
                errorMessage :err.message,
                stackTrace : err.stack
            })
    }
}

export default errorHandler;