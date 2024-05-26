import { Request, Response } from "express";
import { LocationService } from "./location.service";
import httpStatus from "http-status";
import prisma from "../../../shared/prisma";

const find = async (req: Request, res: Response) => {
  try {
    const result = await LocationService.find();
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "All location found successfully",
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
    const result = await LocationService.findById(id);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Single location found successfully",
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

const createNewLocation = async (req: Request, res: Response) => {
  try {
    const data = await req.body;
    const result = await LocationService.createNewLocation(data);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "New location added successfully",
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

const update = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await LocationService.update(id, data);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Location updated successfully",
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
    const result = await LocationService.remove(id);
    return res.status(httpStatus.OK).json({
      status: "Success",
      message: "Location deleted successfully",
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

export const LocationController = {
  find,
  findById,
  createNewLocation,
  update,
  remove,
};
