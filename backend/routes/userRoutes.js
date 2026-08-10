import express from 'express';
import { followAndUnfollowUser, loginUser, logoutUser, myProfile, registerUser, userProfile, updateProfile, endorseSkill, getAllUsers } from '../controllers/userControllers.js';
import { isAuth } from '../middlewares/isAuth.js';

const router=express.Router();

router.post("/register",registerUser);
router.post("/login",loginUser);
router.get("/me",isAuth,myProfile);
router.get("/all",isAuth,getAllUsers);
router.get("/logout",isAuth,logoutUser);
router.put("/profile",isAuth,updateProfile);
router.get("/:id",isAuth,userProfile);
router.post("/follow/:id",isAuth,followAndUnfollowUser);
router.post("/:id/endorse",isAuth,endorseSkill);
export default router;