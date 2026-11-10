import { Request, Response } from "express";

const MAX_CHIRP_LENGTH = 140;

const PROFANE_WORDS = ["kerfuffle", "sharbert", "fornax"];

export function handlerValidateChirp(req: Request, res: Response) {
  const params = req.body;

  if (typeof params?.body !== "string") {
    res.status(400).json({
      error: "Invalid request body",
    });
    return;
  }

  const chirpBody = params.body;

  if (chirpBody.length > MAX_CHIRP_LENGTH) {
    res.status(400).json({
      error: "Chirp is too long",
    });
    return;
  }

  const cleanedBody = PROFANE_WORDS.reduce(
    (acc, word) => acc.replaceAll(new RegExp(word, "gi"), "****"),
    chirpBody,
  );

  res.status(200).json({
    cleanedBody,
  });
}
