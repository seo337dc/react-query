import { NextApiRequest, NextApiResponse } from 'next';
import { IPerson } from '@src/lib/interface/IPerson';

export default (_req: NextApiRequest, res: NextApiResponse): void => {
  console.log('getting person');
  res.status(200).json({ id: '1', name: 'John Doe', age: 25 });
};
