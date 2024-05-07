import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({
  path: './.env.development',
});

const config = {
  type: 'postgres',
  host: `${process.env.DB_HOST}` || 'localhost',
  port: `${process.env.DB_PORT}` || 5432,
  username: `${process.env.DB_USER}`,
  password: `${process.env.DB_PASSWORD}`,
  database: `${process.env.DB_NAME}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
  dropSchema: true,
};

export default registerAs('typeorm', () => config);

export const connectionsSource = new DataSource(config as DataSourceOptions);
