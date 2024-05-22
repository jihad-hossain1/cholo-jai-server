// import { Request, Response } from "express";
// import { LocationService } from "./location.service";
// import httpStatus from "http-status";

// const createChat = async (req: Request, res: Response) => {
//   try {
//     const data = await req.body;

//     const result = await LocationService.createNewLocation(data);

//     return res.status(httpStatus.OK).json({
//       status: "Success",
//       message: "New location added successfully",
//       result: result,
//     });
//   } catch (error) {
//     return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
//       status: "Failed",
//       message: "Something went wrong while register",
//       error: error || "Internal server error",
//     });
//   }
// };
