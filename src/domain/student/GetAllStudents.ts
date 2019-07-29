import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Student } from '../../db';

export async function GetAllStudents(
  req: Request,
  res: Response
): Promise<void> {
  const studentRepository = getManager().getRepository(Student);

  const students = await studentRepository.find();

  res.send(students);
}
