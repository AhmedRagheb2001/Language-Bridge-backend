import cloudinary from "../Config/cloudinary.mjs";

const deleteFromCloudinary = async (public_id)=>
{
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
}

export default deleteFromCloudinary;