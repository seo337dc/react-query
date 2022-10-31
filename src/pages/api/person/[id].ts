// 이걸 자동 등록하도록 할 수 있도록 할 것

import { NextApiRequest, NextApiResponse } from 'next';
import { IPerson } from '@src/lib/interface/IPerson';

export default (req: NextApiRequest, res: NextApiResponse<IPerson | Error>): void => {
  const {
    query: { id },
  } = req;

  if (typeof id === 'string') {
    console.log('getting person by id', id);
    res.status(200).json({ id, name: 'John Doe', age: 25 });
  } else {
    res.status(500).json(new Error('id is not of correct type'));
  }
};
