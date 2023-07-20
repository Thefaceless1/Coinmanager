import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

const config: PostgresConnectionOptions = {
  type: "postgres",
  host: "93.85.88.48",
  port: 5432,
  username: "admin",
  password: "12345",
  database: "coinmanager",
  entities: [__dirname + "/**/*.entity{.ts,.js}"],
  synchronize: true
}
export default config