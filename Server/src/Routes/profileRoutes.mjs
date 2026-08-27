import {Router} from 'express';
import jwtValidate from '../Middlewares/jwtValidate.mjs';
import {getAllProfiles,getProfile,updateProfile,deleteProfile,uploadProfilePicture,
    deleteProfilePicture,updateProfileInformation} from '../Controllers/profileControllers.mjs';
import upload from "../Middlewares/upload.mjs";

const router = Router ();
router.get('/profiles',jwtValidate,getAllProfiles);

router.get('/users/:user_id/profile',jwtValidate,getProfile);

router.patch('/profiles/me',jwtValidate,updateProfile);

router.delete('/profiles/me',jwtValidate,deleteProfile);

router.post("/profiles/me/profilePicture",jwtValidate,upload.single("profilePicture"),uploadProfilePicture);

router.delete("/profiles/me/profilePicture",jwtValidate,deleteProfilePicture)

router.patch("/profiles/:profile_id",jwtValidate,updateProfileInformation)
export default router;