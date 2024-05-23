import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({
  path: './.env.development',
});

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

const config = {
  type: 'postgres',
  host: DB_HOST || 'localhost',
  port: DB_PORT || 5432,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: false,
  autoLoadEntities: true,
  logging: true,
  dropSchema: false,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};

export default registerAs('typeorm', () => config);

export const connectionsSource = new DataSource(config as DataSourceOptions);
