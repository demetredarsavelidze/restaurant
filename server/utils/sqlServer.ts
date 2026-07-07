import sql from "mssql";

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes"].includes(value.toLowerCase());
};

const getConfig = (): sql.config | string => {
  if (process.env.MSSQL_CONNECTION_STRING) {
    return process.env.MSSQL_CONNECTION_STRING;
  }

  return {
    server: process.env.SQL_SERVER ?? "localhost",
    port: Number(process.env.SQL_PORT ?? 1433),
    database: process.env.SQL_DATABASE ?? "restaurant_reservations",
    user: process.env.SQL_USER ?? "sa",
    password: process.env.SQL_PASSWORD ?? "YourStrong!Passw0rd",
    options: {
      encrypt: toBoolean(process.env.SQL_ENCRYPT, false),
      trustServerCertificate: toBoolean(process.env.SQL_TRUST_SERVER_CERTIFICATE, true),
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  };
};

let poolPromise: Promise<sql.ConnectionPool> | undefined;

export const getPool = () => {
  poolPromise ??= sql.connect(getConfig());
  return poolPromise;
};

export const closePool = async () => {
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
    poolPromise = undefined;
  }
};

export { sql };
