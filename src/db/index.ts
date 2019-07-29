import 'reflect-metadata';
import { createConnection, Connection } from 'typeorm';
import { Student as StudentEntity } from './models/Student';
import { User as UserEntity } from './models/User';
import { School as SchoolEntity } from './models/School';

export const connectDb = (): Promise<Connection> =>
  createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'postgres',
    entities: [StudentEntity, UserEntity, SchoolEntity],
    synchronize: true,
    logging: false
  });

export const Student = StudentEntity;
