import type { NextFunction, Request, Response } from "express";

const unknownEndPoint = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).send("route don't exit");
};

export default unknownEndPoint;
