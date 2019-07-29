import { Request, Response } from 'express';
import { MethodType } from './MethodType';

export interface API {
  route: string;
  method: MethodType;
  action: (req: Request, res: Response) => void;
}
