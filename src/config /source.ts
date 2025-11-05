import 'dotenv/config';
import oracledb from 'oracledb';

export async function getConnection() {
  return await oracledb.getConnection({
    user: process.env.DATABASE_USERNAME!,
    password: process.env.DATABASE_PASSWORD!,
    connectString: process.env.DATABASE_HOSTNAME!,
  });
}