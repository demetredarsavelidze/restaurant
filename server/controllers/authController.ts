import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { loginSchema } from "../utils/validation.js";
import { HttpError } from "../utils/httpError.js";
import { getPool, sql } from "../utils/sqlServer.js";
import type { DbUser } from "../types/db.js";

const getSecret = () => process.env.JWT_SECRET ?? "development-secret-change-me";

export const login = async (req: Request, res: Response) => {
  const credentials = loginSchema.parse(req.body);

  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", sql.NVarChar(320), credentials.email.toLowerCase())
    .query<DbUser>("SELECT TOP (1) * FROM [User] WHERE [email] = @email;");
  const user = result.recordset[0];

  if (!user) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const matches = await bcrypt.compare(credentials.password, user.password);

  if (!matches) {
    throw new HttpError(401, "Invalid email or password.");
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    getSecret(),
    { expiresIn: "8h" },
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};
