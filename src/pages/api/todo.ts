import { NextApiRequest, NextApiResponse } from 'next';
import { ITodo } from '@src/lib/interface/ITodo';

export default (_req: NextApiRequest, res: NextApiResponse<ITodo>): void => {
  res.status(200).json({ message: 'i am todo' });
};
