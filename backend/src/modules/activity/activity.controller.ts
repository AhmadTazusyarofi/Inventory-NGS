import { Request, Response } from "express";
import { ActivityService } from "./activity.service";

const service = new ActivityService();

export class ActivityController {
  async getAll(_req: Request, res: Response) {
    try {
      const data = await service.getAll();
      return res.json({ success: true, data });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch activities",
      });
    }
  }
}
