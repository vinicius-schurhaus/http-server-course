import { Request, Response } from "express";
import { createUser } from "../db/queries/users.js";

type CreateUserParams = {
  email: string;
};

export async function handlerCreateUser(req: Request, res: Response) {
  const body = req.body as CreateUserParams;

  if (body.email === undefined) {
    res.status(400).json({
      error: "Email is required.",
    });
    return;
  }

  const user = await createUser({ email: body.email });

  if (user === undefined) {
    throw new Error("Erro ao criar usuário");
  }

  res.status(201).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
}
