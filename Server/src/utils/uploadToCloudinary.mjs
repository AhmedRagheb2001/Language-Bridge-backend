import {Readable} from "stream";
import cloudinary from "../Config/cloudinary.mjs";

const uploadToCloudinary = (buffer,folder) =>{
    return new Promise ((resolve,reject) => {
        const uploadStream = cloudinary.uploader.upload_stream({
            folder : folder
        },
        (err,result) =>{
            if(err){
                reject(err);
                return;
            }
            resolve(result);
        });
        Readable.from(buffer).pipe(uploadStream);
    })
}
export default uploadToCloudinary;