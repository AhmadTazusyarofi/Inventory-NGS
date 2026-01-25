import { Request, Response } from "express";
import { AuthService } from "./auth.service";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { identifier, password } = req.body;
      const result = await authService.login(identifier, password);

      return res.json({
        success: true,
        message: "Login successful",
        data: result,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { nama, username, email, password, role } = req.body;

      const result = await authService.register({
        nama,
        username,
        email,
        password,
        role,
      });

      return res.status(201).json({
        success: true,
        message: "Register successful",
        data: result,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Register failed",
      });
    }
  }
}
