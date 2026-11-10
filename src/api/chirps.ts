import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";

const MAX_CHIRP_LENGTH = 140;

const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"];

type CreateChirpParams = {
  body: string;
  userId: string;
};

export async function handlerCreateChirp(req: Request, res: Response) {
  const params = req.body as CreateChirpParams;

  if (params.body === undefined) {
    res.status(400).json({
      error: "Body is required.",
    });
    return;
  }

  if (params.userId === undefined) {
    res.status(400).json({
      error: "User ID is required.",
    });
    return;
  }

  const body = params.body;

  if (body.length > MAX_CHIRP_LENGTH) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = PROFANE_WORDS.reduce(
    (acc, word) => acc.replaceAll(new RegExp(word, "gi"), "****"),
    body,
  );

  const chirp = await createChirp({ body: cleanedBody, userId: params.userId });

  if (chirp === undefined) {
    throw new Error("Error creating chirp.");
  }

  res.status(201).json({
  id: chirp.id,
  createdAt: chirp.createdAt,
  updatedAt: chirp.updatedAt,
  body: chirp.body,
  userId: chirp.userId
});
}
