import { Request, Response } from "express";
import { ConnectedLocationService } from "./connected.service";
import httpStatus from "http-status";

const find = async (req: Request, res: Response) => {
  try {
    const result = await ConnectedLocationService.find();
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "All connected location found successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while register",
      error: error || "Internal server error",
    });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await ConnectedLocationService.findById(id);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Single connected location found successfully",
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

const createNewConnectedLocation = async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    const result = await ConnectedLocationService.createNewConnectedLocation(
      data
    );
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "New connected location added successfully",
      result: result,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      status: "Failed",
      message: "Something went wrong while created connected location",
      error: error || "Internal server error",
    });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await ConnectedLocationService.update(id, data);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Connected location updated successfully",
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
    const result = await ConnectedLocationService.remove(id);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Connected location deleted successfully",
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

export const ConnectedLocationController = {
  find,
  findById,
  createNewConnectedLocation,
  update,
  remove,
};
