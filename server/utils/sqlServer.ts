import tediousSql from "mssql";

type SqlModule = typeof tediousSql;
type Msnodesqlv8Config = tediousSql.config & {
  connectionString: string;
};
type SqlConfig = tediousSql.config | Msnodesqlv8Config | string;

export let sql: SqlModule = tediousSql;

const toBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return ["1", "true", "yes"].includes(value.toLowerCase());
};

const hasValue = (value: string | undefined) => Boolean(value?.trim());

const usesTrustedConnectionString = (value: string) =>
  /(?:Trusted_Connection|Trusted Connection)\s*=\s*(?:yes|true|sspi)/i.test(value) ||
  /Integrated Security\s*=\s*(?:true|sspi)/i.test(value);

const toOdbcBoolean = (value: string | undefined, fallback: boolean) =>
  toBoolean(value, fallback) ? "Yes" : "No";

const getSqlServerAddress = () => {
  const server = process.env.SQL_SERVER ?? "localhost";
  const port = process.env.SQL_PORT;

  if (!hasValue(port) || server.includes("\\") || server.includes(",")) {
    return server;
  }

  return `${server},${port}`;
};

const getWindowsAuthConnectionString = () => {
  const driver = process.env.SQL_ODBC_DRIVER ?? "ODBC Driver 18 for SQL Server";
  const database = process.env.SQL_DATABASE ?? "restaurant_reservations";

  return [
    `Driver={${driver}}`,
    `Server=${getSqlServerAddress()}`,
    `Database=${database}`,
    "Trusted_Connection=Yes",
    `Encrypt=${toOdbcBoolean(process.env.SQL_ENCRYPT, false)}`,
    `TrustServerCertificate=${toOdbcBoolean(process.env.SQL_TRUST_SERVER_CERTIFICATE, true)}`,
  ].join(";");
};

const getConnectionSettings = (): { config: SqlConfig; useWindowsAuth: boolean } => {
  const connectionString = process.env.MSSQL_CONNECTION_STRING;

  if (connectionString) {
    return {
      config: connectionString,
      useWindowsAuth: usesTrustedConnectionString(connectionString),
    };
  }

  const useSqlAuth = hasValue(process.env.SQL_USER) && hasValue(process.env.SQL_PASSWORD);

  if (!useSqlAuth) {
    return {
      config: {
        server: process.env.SQL_SERVER ?? "localhost",
        database: process.env.SQL_DATABASE ?? "restaurant_reservations",
        connectionString: getWindowsAuthConnectionString(),
        pool: {
          max: 10,
          min: 0,
          idleTimeoutMillis: 30000,
        },
      },
      useWindowsAuth: true,
    };
  }

  const config: tediousSql.config = {
    server: process.env.SQL_SERVER ?? "localhost",
    port: Number(process.env.SQL_PORT ?? 1433),
    database: process.env.SQL_DATABASE ?? "restaurant_reservations",
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

  if (useSqlAuth) {
    config.user = process.env.SQL_USER;
    config.password = process.env.SQL_PASSWORD;
  }

  return {
    config,
    useWindowsAuth: false,
  };
};

const loadDriver = async (useWindowsAuth: boolean): Promise<SqlModule> => {
  if (!useWindowsAuth) {
    sql = tediousSql;
    return sql;
  }

  try {
    const windowsSql = await import("mssql/msnodesqlv8");
    sql = (windowsSql.default ?? windowsSql) as SqlModule;
    return sql;
  } catch (error) {
    throw new Error(
      "Windows Authentication requires the optional msnodesqlv8 driver. Run `npm install` on your Windows machine and make sure Microsoft ODBC Driver for SQL Server is installed.",
      { cause: error },
    );
  }
};

let poolPromise: Promise<tediousSql.ConnectionPool> | undefined;

export const getPool = () => {
  poolPromise ??= (async () => {
    const { config, useWindowsAuth } = getConnectionSettings();
    const driver = await loadDriver(useWindowsAuth);
    return driver.connect(config);
  })();
  return poolPromise;
};

export const closePool = async () => {
  if (poolPromise) {
    const pool = await poolPromise;
    await pool.close();
    poolPromise = undefined;
  }
};
