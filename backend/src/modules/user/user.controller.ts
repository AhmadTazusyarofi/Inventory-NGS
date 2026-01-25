import { Request, Response } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export class UserController {
  async getAll(_req: Request, res: Response) {
    try {
      const users = await service.getAll();
      return res.json({ success: true, data: users });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to fetch users",
      });
    }
  }

  async updateMe(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { nama, email } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const user = await service.updateProfile(userId, { nama, email });

      return res.json({
        success: true,
        message: "Profile updated successfully",
        data: user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update profile",
      });
    }
  }

  async changeMyPassword(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { currentPassword, newPassword } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      await service.changePassword(userId, currentPassword, newPassword);

      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to update password",
      });
    }
  }
}
