import express, { type Express } from "express";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";

import { handlerReadiness } from "./api/readiness.js";
import {
  errorHandler,
  middlewareLogResponses,
  middlewareMetricsInc,
} from "./api/middleware.js";
import { handlerMetrics, handlerReset } from "./api/metrics.js";
import { handlerCreateChirp, handlerGetChirps } from "./api/chirps.js";
import { config } from "./config.js";
import { handlerCreateUser } from "./api/users.js";

// Run database migrations
const migrationClient = postgres(config.db.dbURL, { max: 1 });

await migrate(drizzle(migrationClient), config.db.migrationConfig);

await migrationClient.end();

// Start server
function main(): void {
  const app: Express = express();
  const port = config.api.port;

  app.use(express.json());
  app.use(middlewareLogResponses);
  app.use("/app", middlewareMetricsInc, express.static("./src/app"));

  app.get("/api/healthz", handlerReadiness);
  app.post("/api/chirps", handlerCreateChirp);
  app.get("/admin/metrics", handlerMetrics);
  app.post("/admin/reset", handlerReset);
  app.post("/api/users", handlerCreateUser);
  app.get("/api/chirps", handlerGetChirps);

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

main();
