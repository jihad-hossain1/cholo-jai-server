import { Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "./user.service";
import prisma from "../../../shared/prisma";

const find = async (req: Request, res: Response) => {
  // const query = req.

  const { page = 1, limit = 10, search = "" } = req.query;

  try {
    const result = await UserService.find(
      Number(page),
      Number(limit),
      search as string
    );
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Users fetched successfully",
      data: result.users,
      totalCount: result.totalCount,
      currentPage: Number(page),
      totalPages: Math.ceil(result.totalCount / Number(limit)),
    });
  } catch (error: any) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while fetching users",
      error: error.message || "Internal server error",
    });
  }
};
// const find = async (req: Request, res: Response) => {
//   try {
//     const result = await UserService.find();
//     return res.status(httpStatus.OK).json({
//       status: "Success",
//       message: "All users find successfully",
//       result: result,
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: "Failed",
//       message: "Something went wrong while find all user",
//       error: error || "Internal server error",
//     });
//   }
// };
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

const bookmark = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const split = id?.split("=")[1];

    if (!data?.userId || !id) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Failed",
        message: "User id and marked id is required",
      });
    }

    const findDuplicate = await prisma.bookMark.findFirst({
      where: {
        userId: data?.userId,
        markedId: split,
      },
    });

    if (findDuplicate) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Failed",
        message: "User already bookmarked",
      });
    }

    const result = await UserService.bookmark({
      userId: data?.userId,
      markedId: split,
    });
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User bookmark successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while bookmark user",
      error: error || "Internal server error",
    });
  }
};

const findId = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userIdSpit = id?.split("=")[1];

    const result = await UserService.findId(userIdSpit);

    if (!result) {
      return res.status(httpStatus.BAD_REQUEST).json({
        status: "Failed",
        message: "User not found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "user find successfully",
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

const findBookmarks = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await UserService.findBookmarks({ userId: id });

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "User find successfully",
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

export const UserController = {
  find,
  findById,
  update,
  remove,
  findByMobile,
  bookmark,
  findId,
  findBookmarks,
};
