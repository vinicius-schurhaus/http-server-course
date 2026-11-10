import { Request, Response } from "express";
import { BadRequestError } from "./errors.js";

const MAX_CHIRP_LENGTH = 140;

const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"];

export async function handlerValidateChirp(req: Request, res: Response) {
  const params = req.body;

  if (typeof params?.body !== "string") {
    throw new Error("Chirp is too long");
  }

  const chirpBody = params.body;

  if (chirpBody.length > MAX_CHIRP_LENGTH) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  const cleanedBody = PROFANE_WORDS.reduce(
    (acc, word) => acc.replaceAll(new RegExp(word, "gi"), "****"),
    chirpBody,
  );

  res.status(200).json({
    cleanedBody,
  });
}
