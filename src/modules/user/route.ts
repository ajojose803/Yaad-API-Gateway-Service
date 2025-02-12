import express, { Router } from "express";
import userController from "./controller";
import upload from "../../middleware/multer";
// import {isvalidated}

const userRouter: Router = express.Router();
const controller = new userController();

userRouter.post('/signupOtp', controller.signupOtp);
userRouter.post('/registerUser', upload.single('image'), controller.registerUser);
userRouter.post('/resendOtp', controller.resendOtp);
userRouter.post('/loginUser', controller.loginUser);

export default userRouter;
// userRouter.post('/resendOtp', controller.resendOtp);