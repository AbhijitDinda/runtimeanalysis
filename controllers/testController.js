import ResponseHandler from "../utils/responseHandler.js";

export const TestConnection = async (req, res) => {
  try {
    ResponseHandler.success(res, "Connected to Server");
  } catch (error) {
    ResponseHandler.error(res, "Error connecting to Server", 500, error);
  }
};
