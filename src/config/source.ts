import 'dotenv/config';
import oracledb from 'oracledb';

export async function getConnection(): Promise<oracledb.Connection> {
  const user = process.env.DATABASE_USERNAME;
  const password = process.env.DATABASE_PASSWORD;
  const connectString = process.env.DATABASE_HOSTNAME;

  if (!user || !password || !connectString) {
    throw new Error('Database environment variables are not properly set');
  }

  try {
    const connection = await oracledb.getConnection({ user, password, connectString });
    return connection;
  } catch (err) {
    console.error('Error connecting to Oracle DB:', err);
    throw err;
  }
}