import type { MigrationConfig } from "drizzle-orm/migrator";

process.loadEnvFile();

function envOrThrow(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value;
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

type DBConfig = {
  dbURL: string;
  migrationConfig: MigrationConfig;
};

type APIConfig = {
  port: number;
  fileserverHits: number;
  platform: string;
};

export const config: {
  api: APIConfig;
  db: DBConfig;
} = {
  api: {
    port: Number(envOrThrow("PORT")),
    fileserverHits: 0,
    platform: envOrThrow("PLATFORM"),
  },
  db: {
    dbURL: envOrThrow("DB_URL"),
    migrationConfig,
  },
};
