import { Request, Response, NextFunction } from "express";
import { CustomException } from "../lib/custom-exception";

export const exceptionMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  
  if (error instanceof CustomException) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message
    });
  }

  return res.status(500).json({
    status: 500,
    message: "Internal Server Error"
  });
};