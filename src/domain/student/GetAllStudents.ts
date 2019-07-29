import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Student } from '../../db';

export async function GetAllStudents(
  req: Request,
  res: Response
): Promise<void> {
  res.sendStatus(200);
}
