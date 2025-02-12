import { Request, Response } from "express";
import { AuthResponse } from "../../interfaces/interface";
import { StatusCode } from "../../interfaces/enum";
import { UserService } from "./config/gRPC-client/user.client";
import uploadToS3 from "../../services/s3";

export default class userController {
  loginUser = (req: Request, res: Response): void => {
    try {
      // console.log(req.body)
      UserService.LoginUser(req.body, (err: any, result: AuthResponse) => {
        if (err) {
          res.status(StatusCode.BadRequest).json({ message: err });
        } else {
          console.log(result);
          res.status(StatusCode.Created).json(result);
        }
      });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  };

  signupOtp = (req: Request, res: Response): void => {
    try {
      console.log("Incoming request body:", req.body);
      UserService.SignupOtp(
        req.body,
        (err: any, result: { message: string }) => {
          if (err) {
            console.log(err);
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  };

  registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("Incoming request body:", req.body);
      const files: Express.Multer.File | undefined = req.file;
      let userImage = "";

      if (files) {
        userImage = await uploadToS3(files);
      }

      UserService.RegisterUser(
        { ...req.body, userImage },
        (err: any, result: AuthResponse) => {
          if (err) {
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  }

  resendOtp = (req: Request, res: Response): void => {
    try {
      UserService.ResendOtp(req.body, (err: any, result: { message: string }) => {
        if (err) {
          res.status(StatusCode.BadRequest).json({ message: err });
        } else {
          res.status(StatusCode.Created).json(result);
        }
      });
    } catch (error) {
      console.log(error);
      res
        .status(StatusCode.InternalServerError)
        .json({ message: "Internal Server Error" });
    }
  }
}
