import { NextApiRequest, NextApiResponse } from 'next';
import { ITodo } from '@src/lib/interface/ITodo';

export default (_req: NextApiRequest, res: NextApiResponse<ITodo>): void => {
  res.status(200).json({ id: 1, message: 'i am todo' });
};
