import { Request, Response, NextFunction } from "express";
export const notFoundRoutes = (req: Request, res: Response, next: NextFunction): void => {
  res.status(404).json({
    success: false,
    statusCode: 404,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: `The requested path '${req.originalUrl}' does not exist on this server.`,
      },
    ],
    // ISO format is the standard for APIs (e.g., 2026-01-27T10:55:00Z)
    timestamp: new Date().toISOString(), 
  });
};