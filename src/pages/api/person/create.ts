import { NextApiRequest, NextApiResponse } from 'next';
import { IPerson } from '@src/lib/interface/IPerson';

export default (req: NextApiRequest, res: NextApiResponse) => {
  const data: IPerson = JSON.parse(req.body);
  res.status(200).json(data);
};
