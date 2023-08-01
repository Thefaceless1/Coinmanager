import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import 'dotenv/config'

const ormconfig: PostgresConnectionOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [__dirname + "/entity/*.entity{.ts,.js}"],
  synchronize: false,
  migrations: [__dirname + "/migrations/*{.ts,.js}"]
}
export default ormconfig