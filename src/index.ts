import express, { type Express, type Request, type Response } from "express";
import { handlerReadiness } from "./api/readiness.js";
import {
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerValidateChirp } from "./api/chirps.js";

function main() {
  const app: Express = express();
  const PORT = 8080;

  app.use(express.json());
  app.use(middlewareLogResponses);
  app.use("/app", middlewareMetricsInc, express.static("./src/app"));

  app.get("/api/healthz", handlerReadiness);
  app.post("/api/validate_chirp", handlerValidateChirp);
  app.get("/admin/metrics", handlerMetrics);
  app.post("/admin/reset", handlerReset);

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

main();
