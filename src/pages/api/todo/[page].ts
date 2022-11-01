import { NextApiRequest, NextApiResponse } from 'next';
import { IPagenatedTodos } from '@src/lib/interface/IPaginateTodos';
import { ITodo } from '@src/lib/interface/ITodo';

export default (req: NextApiRequest, res: NextApiResponse<IPagenatedTodos | Error>): void => {
  const {
    query: { page },
  } = req;

  if (typeof page === 'string') {
    console.log(`getting page number: ${page}`);
    const returnTodos: ITodo[] = [];
    // eslint-disable-next-line radix
    const nums = parseInt(page) * 5;
    for (let i = nums; i < nums + 5; i += 1) {
      const returnTodo: ITodo = {
        id: i,
        message: `Todo number: ${i}`,
      };
      returnTodos.push(returnTodo);
    }

    res.status(200).json({ todos: returnTodos, hasMore: page !== '4' });
  } else {
    res.status(500).json(new Error('id is not of correct type'));
  }
};
