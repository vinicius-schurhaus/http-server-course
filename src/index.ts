import express, { type Express, type Request, type Response } from "express";
import { handlerReadiness } from "./api/readiness.js";

function main() {
  const app: Express = express();
  const PORT = 8080;

  app.use("/app", express.static("./src/app"));

  app.get("/healthz", handlerReadiness);

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

main();
