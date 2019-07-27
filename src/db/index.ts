import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { Student as StudentEntity } from './models/Student';

export const connectDb = (): Promise<Connection> =>
  createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'postgres',
    entities: [StudentEntity],
    synchronize: true,
    logging: false
  });

export const Student = StudentEntity;
