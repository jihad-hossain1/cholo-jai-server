import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";

const find = async (req: Request, res: Response) => {
  try {
    const result = await UserService.find();
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "All users find successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while find all user",
      error: error || "Internal server error",
    });
  }
};
const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await UserService.findById(id);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Single user find successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while find single user",
      error: error || "Internal server error",
    });
  }
};
const findByMobile = async (req: Request, res: Response) => {
  try {
    const mobile = req.params.mobile;
    const result = await UserService.findByMobile(mobile);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Single user find successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while find single user",
      error: error || "Internal server error",
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await UserService.update(id, data);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User update successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while update user",
      error: error || "Internal server error",
    });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await UserService.remove(id);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User delete successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while delete user",
      error: error || "Internal server error",
    });
  }
};

export const UserController = {
  find,
  findById,
  update,
  remove,
  findByMobile,
};
