import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { Student } from '../db';

export async function PostStudent(req: Request, res: Response): Promise<void> {
  const studentRepository = getManager().getRepository(Student);

  const student = studentRepository.create(req.body);

  await studentRepository.save(student);

  res.send(student);
}
