import { Request, Response } from "express";
import httpStatus from "http-status";
import { SearchService } from "./search.service";
import prisma from "../../../shared/prisma";

const search = async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    const result = await SearchService.search(data);

    if (!result) {
      return res.status(httpStatus.NOT_FOUND).json({
        status: "Failed",
        message: "User information not found",
      });
    }

    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Search user find successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while searing a user",
      error: error || "Internal server error",
    });
  }
};

export const SearchController = {
  search,
};
